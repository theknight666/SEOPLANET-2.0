import os
import sys
from huggingface_hub import HfApi
from dotenv import load_dotenv

def set_hf_secrets(token, space_name):
    api = HfApi(token=token)
    
    # Path to the .env file
    env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
    
    if not os.path.exists(env_path):
        print(f"Could not find .env file at {env_path}")
        return
        
    print(f"Setting secrets for {space_name}...")
    
    # Read the .env manually to preserve everything
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, value = line.split('=', 1)
                try:
                    api.add_space_secret(repo_id=space_name, key=key.strip(), value=value.strip())
                    print(f"Set secret: {key.strip()}")
                except Exception as e:
                    print(f"Error setting {key}: {e}")
                    
    print("All secrets have been configured!")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))
    load_dotenv()
    
    hf_token = os.environ.get('HF_TOKEN')
    hf_space_name = os.environ.get('HF_SPACE_NAME', 'seoplanet/seoplanet-backend')
    
    if len(sys.argv) == 3:
        hf_token = sys.argv[1]
        hf_space_name = sys.argv[2]
    elif len(sys.argv) == 2:
        hf_space_name = sys.argv[1]
        
    if not hf_token:
        print("Error: HF_TOKEN not found in environment or .env file.")
        print("Usage: python set_secrets_hf.py <HF_TOKEN> <SPACE_NAME>")
        sys.exit(1)
        
    set_hf_secrets(hf_token, hf_space_name)
