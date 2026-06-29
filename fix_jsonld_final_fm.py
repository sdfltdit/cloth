import re
import os

targets = {
    'canonicalUrl.href': 'Astro.url.href',
    'canonical.href': 'Astro.url.href',
    'sdfclothing.com': 'sdfltd.com',
    'durobal.netlify.app': 'sdfltd.com',
    'boom3model.workers.dev': 'sdfltd.com',
    'chowdhury-remon.pages.dev': 'sdfltd.com',
    'sdf-email.boom3model.workers.dev': 'sdfltd.com'
}

def replace_targets(text):
    for k, v in targets.items():
        text = text.replace(k, v)
    return text

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    new_content = content
    parts = new_content.split('---')
    if len(parts) >= 3:
        frontmatter = parts[1]
        # Aggressive replacement in ALL frontmatter since it is non-HTML/layout
        new_frontmatter = replace_targets(frontmatter)
        if new_frontmatter != frontmatter:
            parts[1] = new_frontmatter
            new_content = '---'.join(parts)

    # Also fix direct script blocks
    def script_repl(m):
        return m.group(1) + replace_targets(m.group(2)) + m.group(3)
    new_content = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', script_repl, new_content, flags=re.DOTALL)
    new_content = re.sub(r'(<script type="application/ld\+json"\s+set:html=\{JSON\.stringify\()(.*?)(\)\}\s*/>)', script_repl, new_content, flags=re.DOTALL)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

if __name__ == "__main__":
    import subprocess
    target_regex = '|'.join([re.escape(k) for k in targets.keys()])
    result = subprocess.run(['grep', '-rlE', target_regex, 'src/pages/'], capture_output=True, text=True)
    files = result.stdout.splitlines()

    for f in files:
        if os.path.exists(f):
            if fix_file(f):
                print(f"Fixed {f}")
