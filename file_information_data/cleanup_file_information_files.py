import os
from pathlib import Path

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
KEEP_DIR = os.path.abspath(os.path.dirname(__file__))
TARGET_PATTERN = 'file_information.md'

def main():
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        # Skip the file_information_data folder itself
        if os.path.abspath(dirpath) == KEEP_DIR:
            continue
        for filename in filenames:
            if TARGET_PATTERN in filename:
                file_path = Path(dirpath) / filename
                try:
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
                except Exception as e:
                    print(f"Failed to delete {file_path}: {e}")

if __name__ == '__main__':
    main()
