import os, glob

files = glob.glob('frontend/src/**/*.jsx', recursive=True) + \
        glob.glob('frontend/src/**/*.js', recursive=True) + \
        glob.glob('frontend/src/**/*.tsx', recursive=True) + \
        glob.glob('frontend/src/**/*.ts', recursive=True)

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if 'https://seoplanet-2-0.onrender.com' in content:
            new_content = content.replace('https://seoplanet-2-0.onrender.com', 'https://seoplanet-seoplanet-backend.hf.space')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {f}")
    except Exception as e:
        print(f"Failed to process {f}: {e}")
