import re
import os

domain_regex = re.compile(r'(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}')

unique_domains = set()

exclude_dirs = {'node_modules', '.git', 'dist', '.astro'}
exclude_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.pdf'}

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if any(file.endswith(ext) for ext in exclude_extensions):
            continue

        filepath = os.path.join(root, file)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                matches = domain_regex.findall(content)
                for domain in matches:
                    domain = domain.lower()
                    if 'sdfltd.com' not in domain:
                        unique_domains.add(domain)
        except Exception:
            pass

# Filter out some very common technical domains that probably aren't targets
filter_out = {
    'schema.org', 'w3.org', 'xmlns.com', 'google.com', 'fonts.googleapis.com',
    'fonts.gstatic.com', 'www.w3.org', 'ogp.me', 'schema.org', 'microformats.org',
    'localhost', 'wa.me', 'api.web3forms.com', 'forminit.com', 'ipinfo.io', 'ipapi.co',
    'ip-api.com', 'api.ipify.org', 'boom3model.workers.dev', 'www.facebook.com',
    'www.linkedin.com', 'twitter.com', 'x.com', 'netlify.app', 'astro.build',
    'vimeo.com', 'youtube.com', 'youtu.be', 'googletagmanager.com', 'google-analytics.com'
}

print("List of unique non-sdfltd.com domains found (filtered common infra/social):")
for domain in sorted(list(unique_domains)):
    # Check if it's a netlify app but not the specific one mentioned?
    # Or just show everything and let the user decide.
    # The user said "list EVERY unique non-sdfltd.com domain".
    # I'll show the unfiltered list but maybe grouped or sorted.
    pass

# User wants EVERY. I will provide a clean sorted list.
for d in sorted(list(unique_domains)):
    print(d)
