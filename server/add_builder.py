import os
import re

model_dir = r"d:\RRMS\server\src\main\java\com\rrms\rrms\models"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "@Entity" not in content:
        return

    if "@Builder" in content:
        return

    print(f"Processing {filepath}...")

    # Add import
    if "import lombok.Builder;" not in content:
        content = re.sub(r"(import lombok\..*?;)", r"\1\nimport lombok.Builder;", content, count=1)

    # Add @Builder annotation
    # Find @AllArgsConstructor or @NoArgsConstructor or @Entity and add @Builder after it
    if "@AllArgsConstructor" in content:
        content = content.replace("@AllArgsConstructor", "@AllArgsConstructor\n@Builder")
    elif "@Entity" in content:
        content = content.replace("@Entity", "@Entity\n@Builder")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(model_dir):
    if filename.endswith(".java"):
        process_file(os.path.join(model_dir, filename))
