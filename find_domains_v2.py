import re
import os

# Better domain regex: matches common URLs or strings that look like domains
# but tries to avoid properties by requiring a space, quote, or start of line before it.
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

                # Find URLs
                urls = url_pattern.findall(content)
                for url in urls:
                    domain = url.split('//')[-1].split('/')[0].lower()
                    if 'sdfltd.com' not in domain:
                        unique_domains.add(domain)

                # Find other domain-like strings
                matches = domain_pattern.findall(content)
                for domain in matches:
                    domain = domain.lower().strip('.')
                    if 'sdfltd.com' not in domain:
                        unique_domains.add(domain)
        except Exception:
            pass

# Known target domains to make sure they are included
target_candidates = {'sdfclothing.com', 'durobal.netlify.app'}

# Infra domains to filter
infra_domains = {
    'schema.org', 'w3.org', 'xmlns.com', 'google.com', 'fonts.googleapis.com',
    'fonts.gstatic.com', 'ogp.me', 'microformats.org', 'localhost', 'wa.me',
    'api.web3forms.com', 'forminit.com', 'ipinfo.io', 'ipapi.co', 'ip-api.com',
    'api.ipify.org', 'boom3model.workers.dev', 'facebook.com', 'www.facebook.com',
    'linkedin.com', 'www.linkedin.com', 'twitter.com', 'x.com', 'netlify.app',
    'astro.build', 'vimeo.com', 'youtube.com', 'youtu.be', 'googletagmanager.com',
    'google-analytics.com', 'roadmaptozero.com', 'oeko-tex.com', 'global-standard.org',
    'sedex.com', 'amfori.org', 'bureauveritas.com', 'intertek.com', 'sgs.com',
    'wrapcompliance.org', 'worldbank.org', 'ilo.org', 'unep.org', 'wto.org'
}

print("### Unique Non-sdfltd.com Domains Found ###")
for d in sorted(list(unique_domains)):
    if d in infra_domains or any(infra in d for infra in infra_domains):
        continue
    print(d)
