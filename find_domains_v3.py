import re
import os

url_pattern = re.compile(r'https?://(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}')
domain_pattern = re.compile(r'(?<=[\s\'\"(=])(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|io|app|gov|uk|edu|tv|dev|me)(?=[ \s\'\"/?)])')

unique_domains = set()

exclude_dirs = {'node_modules', '.git', 'dist', '.astro'}
exclude_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.pdf', '.tgz'}

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if any(file.endswith(ext) for ext in exclude_extensions):
            continue

        filepath = os.path.join(root, file)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

                urls = url_pattern.findall(content)
                for url in urls:
                    domain = url.split('//')[-1].split('/')[0].lower()
                    if 'sdfltd.com' not in domain:
                        unique_domains.add(domain)

                matches = domain_pattern.findall(content)
                for domain in matches:
                    domain = domain.lower().strip('.')
                    if 'sdfltd.com' not in domain:
                        unique_domains.add(domain)
        except Exception:
            pass

print("### EVERY Unique Non-sdfltd.com Domain Found ###")
for d in sorted(list(unique_domains)):
    print(d)
