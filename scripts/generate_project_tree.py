#!/usr/bin/env python3
"""
Project Tree Generator for AI Consumption
Generates both Markdown (human/AI readable) and JSON (machine parseable) formats
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import argparse
import re

# Directories and patterns to ignore
IGNORE_PATTERNS = {
    'node_modules', '.git', '.next', 'dist', 'build', '.turbo',
    '.DS_Store', 'coverage', '.env', '.env.local', '.vscode',
    '.idea', 'tmp', 'temp', '.cache', '.vercel', '.output',
    '.nuxt', 'out', '.parcel-cache', '__pycache__', '.pytest_cache',
    '*.pyc', '*.pyo', '*.log', '.mypy_cache', 'venv', 'env',
    '.tox', '.eggs', '*.egg-info', '.ruff_cache'
}

# File categories for better AI understanding
FILE_CATEGORIES = {
    'typescript': {'.ts', '.tsx', '.d.ts'},
    'javascript': {'.js', '.jsx', '.mjs', '.cjs'},
    'python': {'.py', '.pyw', '.pyx'},
    'styles': {'.css', '.scss', '.sass', '.less'},
    'data': {'.json', '.yaml', '.yml', '.toml', '.xml'},
    'documentation': {'.md', '.mdx', '.txt', '.rst', '.adoc'},
    'config': {'package.json', 'tsconfig.json', 'next.config.js',
               'turbo.json', 'tailwind.config.js', 'pyproject.toml',
               'setup.py', 'requirements.txt', '.gitignore'},
    'database': {'.sql', '.prisma'},
    'images': {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'},
    'test': {'.test.ts', '.test.tsx', '.test.js', '.spec.ts', '.spec.tsx'}
}

@dataclass
class FileNode:
    """Represents a file in the tree"""
    name: str
    path: str
    type: str = 'file'
    category: str = 'other'
    size: int = 0
    extension: str = ''

@dataclass
class DirectoryNode:
    """Represents a directory in the tree"""
    name: str
    path: str
    type: str = 'directory'
    children: List[Any] = None
    file_count: int = 0
    dir_count: int = 0
    total_size: int = 0

    def __post_init__(self):
        if self.children is None:
            self.children = []

class ProjectTreeGenerator:
    def __init__(self, root_path: str, max_depth: int = 10):
        self.root_path = Path(root_path).resolve()
        self.max_depth = max_depth
        self.stats = {
            'total_files': 0,
            'total_directories': 0,
            'total_size': 0,
            'files_by_category': {},
            'files_by_extension': {},
            'largest_files': [],
            'app_structure': {'apps': [], 'packages': []}
        }

    def should_ignore(self, path: Path) -> bool:
        """Check if a path should be ignored"""
        name = path.name

        # Check exact matches and patterns
        for pattern in IGNORE_PATTERNS:
            if '*' in pattern:
                # Handle wildcard patterns
                regex_pattern = pattern.replace('*', '.*')
                if re.match(regex_pattern, name):
                    return True
            elif name == pattern:
                return True

        return False

    def get_file_category(self, file_path: Path) -> str:
        """Categorize a file based on its extension or name"""
        ext = file_path.suffix.lower()
        name = file_path.name

        # Check full filename matches first
        for category, patterns in FILE_CATEGORIES.items():
            if name in patterns:
                return category

        # Then check extensions
        for category, patterns in FILE_CATEGORIES.items():
            if ext in patterns or name.endswith(tuple(p for p in patterns if p.startswith('.'))):
                return category

        return 'other'

    def build_tree(self, path: Path, depth: int = 0) -> Optional[Dict[str, Any]]:
        """Recursively build the tree structure"""
        if depth > self.max_depth:
            return None

        if self.should_ignore(path):
            return None

        try:
            if path.is_file():
                size = path.stat().st_size
                category = self.get_file_category(path)

                # Update stats
                self.stats['total_files'] += 1
                self.stats['total_size'] += size
                self.stats['files_by_category'][category] = \
                    self.stats['files_by_category'].get(category, 0) + 1

                ext = path.suffix.lower()
                if ext:
                    self.stats['files_by_extension'][ext] = \
                        self.stats['files_by_extension'].get(ext, 0) + 1

                # Track largest files
                self.stats['largest_files'].append({
                    'name': path.name,
                    'path': str(path.relative_to(self.root_path)),
                    'size': size
                })

                return FileNode(
                    name=path.name,
                    path=str(path.relative_to(self.root_path)),
                    category=category,
                    size=size,
                    extension=ext
                )

            elif path.is_dir():
                self.stats['total_directories'] += 1

                node = DirectoryNode(
                    name=path.name,
                    path=str(path.relative_to(self.root_path)) if path != self.root_path else '/'
                )

                # Track turborepo structure
                if depth == 1:
                    if path.name == 'apps':
                        for app_dir in sorted(path.iterdir()):
                            if app_dir.is_dir() and not self.should_ignore(app_dir):
                                self.stats['app_structure']['apps'].append(app_dir.name)
                    elif path.name == 'packages':
                        for pkg_dir in sorted(path.iterdir()):
                            if pkg_dir.is_dir() and not self.should_ignore(pkg_dir):
                                self.stats['app_structure']['packages'].append(pkg_dir.name)

                # Process children
                for child_path in sorted(path.iterdir()):
                    child_node = self.build_tree(child_path, depth + 1)
                    if child_node:
                        node.children.append(child_node)
                        if isinstance(child_node, FileNode):
                            node.file_count += 1
                            node.total_size += child_node.size
                        elif isinstance(child_node, DirectoryNode):
                            node.dir_count += 1
                            node.file_count += child_node.file_count
                            node.total_size += child_node.total_size

                return node

        except PermissionError:
            return None

        return None

    def format_size(self, size: int) -> str:
        """Format file size in human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size:.2f} TB"

    def generate_markdown_tree(self, node: Any, indent: str = '', is_last: bool = True) -> List[str]:
        """Generate markdown representation of the tree - structured for AI understanding"""
        lines = []

        if isinstance(node, DirectoryNode) and node.path == '/':
            # Header and overview
            lines.append(f"# 📦 {self.root_path.name} - Project Structure")
            lines.append(f"*Generated: {datetime.now().isoformat()}*")
            lines.append(f"*Total: {self.stats['total_files']} files, {self.stats['total_directories']} directories, {self.format_size(self.stats['total_size'])}*")

            # High-level architecture overview
            lines.append("\n## 🏗️ Architecture Overview")
            if self.stats['app_structure']['apps']:
                lines.append(f"**📱 Applications ({len(self.stats['app_structure']['apps'])}):** {', '.join(self.stats['app_structure']['apps'])}")
            if self.stats['app_structure']['packages']:
                lines.append(f"**📦 Packages ({len(self.stats['app_structure']['packages'])}):** {', '.join(self.stats['app_structure']['packages'])}")

            # Apps structure overview
            lines.append("\n## 📱 Applications Structure")
            apps_node = self._find_node_by_name(node, 'apps')
            if apps_node:
                for app_node in sorted(apps_node.children, key=lambda x: x.name):
                    if isinstance(app_node, DirectoryNode):
                        lines.extend(self._generate_app_overview(app_node))

            # Packages structure overview
            lines.append("\n## 📦 Packages Structure")
            packages_node = self._find_node_by_name(node, 'packages')
            if packages_node:
                for pkg_node in sorted(packages_node.children, key=lambda x: x.name):
                    if isinstance(pkg_node, DirectoryNode):
                        lines.extend(self._generate_package_overview(pkg_node))

            # Root level files
            lines.append("\n## 📄 Root Level")
            lines.append("```")
            lines.append(f"{self.root_path.name}/")
            root_files = [child for child in node.children if isinstance(child, FileNode)]
            root_dirs = [child for child in node.children if isinstance(child, DirectoryNode) and child.name not in ['apps', 'packages']]

            for child in sorted(root_files + root_dirs, key=lambda x: x.name):
                lines.extend(self._generate_simple_tree_item(child, '', True))
            lines.append("```")

            # Detailed breakdown
            lines.append("\n## 🔍 Detailed Structure")
            lines.append("```")
            lines.append(f"{self.root_path.name}/")
            for i, child in enumerate(sorted(node.children, key=lambda x: x.name)):
                is_child_last = i == len(node.children) - 1
                lines.extend(self._generate_detailed_tree(child, '', is_child_last))
            lines.append("```")

        return lines

    def _find_node_by_name(self, node: DirectoryNode, name: str) -> Optional[DirectoryNode]:
        """Find a child node by name"""
        for child in node.children:
            if isinstance(child, DirectoryNode) and child.name == name:
                return child
        return None

    def _generate_app_overview(self, app_node: DirectoryNode) -> List[str]:
        """Generate structured overview for an app"""
        lines = []
        app_name = app_node.name

        # App header with description
        descriptions = {
            'customer-web': 'Customer booking, profiles, reviews',
            'salon-dashboard': 'Salon management, analytics, staff',
            'staff-portal': 'Staff schedules, appointments, performance',
            'admin-panel': 'Platform administration, all salons'
        }
        desc = descriptions.get(app_name, 'Application module')

        lines.append(f"\n### 📱 {app_name}")
        lines.append(f"*{desc}*")
        lines.append(f"*{app_node.file_count} files, {self.format_size(app_node.total_size)}*")

        # Core modules structure
        core_node = self._find_node_by_name(app_node, 'core')
        if core_node:
            lines.append("\n**Core Modules:**")
            for module in sorted(core_node.children, key=lambda x: x.name):
                if isinstance(module, DirectoryNode):
                    subfolders = [child.name for child in module.children if isinstance(child, DirectoryNode)]
                    lines.append(f"- `{module.name}/` - {len(subfolders)} subfolders: {', '.join(subfolders[:5])}")

        # Key directories
        key_dirs = ['app', 'components', 'lib', 'public']
        found_dirs = []
        for child in app_node.children:
            if isinstance(child, DirectoryNode) and child.name in key_dirs:
                found_dirs.append(f"`{child.name}/`")

        if found_dirs:
            lines.append(f"\n**Key Directories:** {', '.join(found_dirs)}")

        return lines

    def _generate_package_overview(self, pkg_node: DirectoryNode) -> List[str]:
        """Generate structured overview for a package"""
        lines = []
        pkg_name = pkg_node.name

        descriptions = {
            'supabase': 'Database client and types',
            'ui': 'Shared UI components (shadcn/ui)',
            'auth': 'Authentication utilities',
            'config': 'Shared configuration',
            'utils': 'Utility functions',
            'api': 'API client and types'
        }
        desc = descriptions.get(pkg_name, 'Shared package')

        lines.append(f"\n### 📦 {pkg_name}")
        lines.append(f"*{desc}*")
        lines.append(f"*{pkg_node.file_count} files, {self.format_size(pkg_node.total_size)}*")

        # Main structure
        main_dirs = [child.name for child in pkg_node.children if isinstance(child, DirectoryNode)]
        if main_dirs:
            lines.append(f"**Structure:** {', '.join(main_dirs)}")

        return lines

    def _generate_simple_tree_item(self, node: Any, indent: str, is_last: bool) -> List[str]:
        """Generate simple tree representation for overview"""
        lines = []

        if isinstance(node, DirectoryNode):
            connector = '└── ' if is_last else '├── '
            lines.append(f"{indent}{connector}📁 **{node.name}/** *({node.file_count} files)*")
        elif isinstance(node, FileNode):
            connector = '└── ' if is_last else '├── '
            emoji = '📄' if node.category != 'other' else '📋'
            lines.append(f"{indent}{connector}{emoji} {node.name}")

        return lines

    def _generate_detailed_tree(self, node: Any, indent: str, is_last: bool) -> List[str]:
        """Generate detailed tree representation"""
        lines = []

        if isinstance(node, DirectoryNode):
            connector = '└── ' if is_last else '├── '
            lines.append(f"{indent}{connector}📁 **{node.name}/** "
                       f"*({node.file_count} files, {self.format_size(node.total_size)})*")

            # Add children with limited depth for readability
            for i, child in enumerate(node.children):
                is_child_last = i == len(node.children) - 1
                child_indent = indent + ('    ' if is_last else '│   ')

                # Limit depth to avoid overwhelming detail
                current_depth = len(indent) // 4
                if current_depth < 4:  # Max 4 levels deep
                    lines.extend(self._generate_detailed_tree(child, child_indent, is_child_last))
                elif current_depth == 4 and isinstance(child, DirectoryNode):
                    # Show directory names only at max depth
                    connector = '└── ' if is_child_last else '├── '
                    lines.append(f"{child_indent}{connector}📁 {child.name}/ *({child.file_count} files)*")

        elif isinstance(node, FileNode):
            connector = '└── ' if is_last else '├── '
            size_str = f" ({self.format_size(node.size)})" if node.size > 0 else ""
            emoji = '📄' if node.category != 'other' else '📋'
            lines.append(f"{indent}{connector}{emoji} {node.name}{size_str}")

        return lines

    def generate_markdown_summary(self) -> str:
        """Generate a markdown summary optimized for AI reading"""
        md = ["# 🤖 AI-Optimized Project Structure Summary\n"]
        md.append(f"**Project:** `{self.root_path.name}`\n")
        md.append(f"**Generated:** {datetime.now().isoformat()}\n")
        md.append(f"**Root Path:** `{self.root_path}`\n")

        # Overview
        md.append("\n## 📊 Overview\n")
        md.append(f"- **Total Files:** {self.stats['total_files']:,}")
        md.append(f"- **Total Directories:** {self.stats['total_directories']:,}")
        md.append(f"- **Total Size:** {self.format_size(self.stats['total_size'])}")

        # Turborepo structure if detected
        if self.stats['app_structure']['apps']:
            md.append("\n## 🏗️ Turborepo Structure\n")
            md.append("\n### Applications")
            for app in self.stats['app_structure']['apps']:
                md.append(f"- `apps/{app}/` - {self._get_app_description(app)}")

            md.append("\n### Packages")
            for pkg in self.stats['app_structure']['packages']:
                md.append(f"- `packages/{pkg}/` - {self._get_package_description(pkg)}")

        # File categories
        md.append("\n## 📁 Files by Category\n")
        sorted_categories = sorted(self.stats['files_by_category'].items(),
                                 key=lambda x: x[1], reverse=True)
        for category, count in sorted_categories:
            percentage = (count / self.stats['total_files']) * 100
            md.append(f"- **{category.capitalize()}:** {count} files ({percentage:.1f}%)")

        # Top extensions
        md.append("\n## 📝 Top File Extensions\n")
        sorted_extensions = sorted(self.stats['files_by_extension'].items(),
                                  key=lambda x: x[1], reverse=True)[:10]
        for ext, count in sorted_extensions:
            md.append(f"- `{ext}`: {count} files")

        # Largest files
        md.append("\n## 💾 Largest Files\n")
        largest = sorted(self.stats['largest_files'], key=lambda x: x['size'], reverse=True)[:10]
        for file in largest:
            md.append(f"- `{file['path']}` - {self.format_size(file['size'])}")

        # Core module structure for known apps
        if 'customer-web' in self.stats['app_structure']['apps']:
            md.append("\n## 🎯 Core Module Structure\n")
            md.append(self._generate_core_structure_docs())

        return '\n'.join(md)

    def _get_app_description(self, app_name: str) -> str:
        """Get description for known apps"""
        descriptions = {
            'customer-web': 'Customer booking, profiles, reviews',
            'salon-dashboard': 'Salon management, analytics, staff',
            'staff-portal': 'Staff schedules, appointments, performance',
            'admin-panel': 'Platform administration, all salons'
        }
        return descriptions.get(app_name, 'Application module')

    def _get_package_description(self, pkg_name: str) -> str:
        """Get description for known packages"""
        descriptions = {
            'supabase': 'Database client and types',
            'ui': 'Shared UI components (shadcn/ui)',
            'auth': 'Authentication utilities',
            'config': 'Shared configuration',
            'utils': 'Utility functions',
            'api': 'API client and types',
            'middleware': 'Shared middleware',
            'shared': 'Shared resources'
        }
        return descriptions.get(pkg_name, 'Shared package')

    def _generate_core_structure_docs(self) -> str:
        """Generate documentation for core module structure"""
        docs = []

        app_modules = {
            'customer-web': ['booking', 'discovery', 'profile', 'reviews', 'shared'],
            'salon-dashboard': ['appointments', 'staff', 'services', 'analytics', 'settings', 'shared'],
            'staff-portal': ['schedule', 'appointments', 'performance', 'shared'],
            'admin-panel': ['platform', 'salons', 'analytics', 'compliance', 'shared']
        }

        for app, modules in app_modules.items():
            if app in self.stats['app_structure']['apps']:
                docs.append(f"\n### {app}")
                docs.append("```")
                docs.append(f"apps/{app}/core/")
                for module in modules:
                    docs.append(f"  ├── {module}/")
                    docs.append(f"  │   ├── dal/         # Data Access Layer")
                    docs.append(f"  │   ├── components/  # React components")
                    docs.append(f"  │   ├── hooks/       # Custom hooks")
                    docs.append(f"  │   ├── actions/     # Server actions")
                    docs.append(f"  │   └── types/       # TypeScript types")
                docs.append("```")

        return '\n'.join(docs)

    def generate_json(self, node: Any) -> Dict[str, Any]:
        """Generate JSON representation"""
        def node_to_dict(n: Any) -> Dict[str, Any]:
            if isinstance(n, FileNode):
                return asdict(n)
            elif isinstance(n, DirectoryNode):
                result = {
                    'name': n.name,
                    'path': n.path,
                    'type': n.type,
                    'file_count': n.file_count,
                    'dir_count': n.dir_count,
                    'total_size': n.total_size,
                    'children': [node_to_dict(child) for child in n.children]
                }
                return result
            return {}

        tree_dict = node_to_dict(node)

        # Sort largest files for JSON output
        self.stats['largest_files'] = sorted(
            self.stats['largest_files'],
            key=lambda x: x['size'],
            reverse=True
        )[:20]

        # Add formatted sizes
        for file in self.stats['largest_files']:
            file['size_formatted'] = self.format_size(file['size'])

        return {
            'metadata': {
                'generated': datetime.now().isoformat(),
                'generator': 'figdream-python-tree-generator',
                'version': '1.0.0',
                'root_path': str(self.root_path),
                'project_name': self.root_path.name
            },
            'summary': {
                **self.stats,
                'total_size_formatted': self.format_size(self.stats['total_size'])
            },
            'tree': tree_dict
        }

    def generate(self) -> Tuple[str, str]:
        """Generate both markdown and JSON outputs"""
        print(f"🔍 Analyzing project: {self.root_path}")

        # Build the tree
        root_node = self.build_tree(self.root_path)

        if not root_node:
            raise ValueError("Could not build tree from root path")

        # Generate markdown
        print("📝 Generating Markdown...")
        tree_lines = self.generate_markdown_tree(root_node)
        tree_lines.append("```\n")

        markdown_content = '\n'.join(tree_lines) + '\n\n' + self.generate_markdown_summary()

        # Generate JSON
        print("🔧 Generating JSON...")
        json_content = json.dumps(self.generate_json(root_node), indent=2)

        return markdown_content, json_content

def main():
    parser = argparse.ArgumentParser(description='Generate AI-readable project tree')
    parser.add_argument('path', nargs='?', default='.',
                      help='Root path to analyze (default: current directory)')
    parser.add_argument('--max-depth', type=int, default=10,
                      help='Maximum depth to traverse (default: 10)')
    parser.add_argument('--md-output', default=None,
                      help='Output markdown file (default: docs/architecture/project-structure.md)')
    parser.add_argument('--json-output', default=None,
                      help='Output JSON file (default: docs/architecture/project-structure.json)')

    args = parser.parse_args()

    # Determine project root (where this script is located or current directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent if script_dir.name == 'scripts' else Path.cwd()

    # Set default output paths relative to project root
    default_output_dir = project_root / 'docs' / 'architecture'

    # Use provided paths or defaults
    md_path = Path(args.md_output) if args.md_output else default_output_dir / 'project-structure.md'
    json_path = Path(args.json_output) if args.json_output else default_output_dir / 'project-structure.json'

    # Create output directory if it doesn't exist
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.parent.mkdir(parents=True, exist_ok=True)

    # Generate the tree
    generator = ProjectTreeGenerator(args.path, args.max_depth)

    try:
        markdown_content, json_content = generator.generate()

        # Save markdown
        md_path.write_text(markdown_content)
        print(f"✅ Markdown saved to: {md_path}")

        # Save JSON
        json_path.write_text(json_content)
        print(f"✅ JSON saved to: {json_path}")

        # Print summary
        print(f"\n📊 Summary:")
        print(f"   Files: {generator.stats['total_files']:,}")
        print(f"   Directories: {generator.stats['total_directories']:,}")
        print(f"   Total Size: {generator.format_size(generator.stats['total_size'])}")

        if generator.stats['app_structure']['apps']:
            print(f"\n🏗️  Detected Turborepo:")
            print(f"   Apps: {', '.join(generator.stats['app_structure']['apps'])}")
            print(f"   Packages: {', '.join(generator.stats['app_structure']['packages'])}")

    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())