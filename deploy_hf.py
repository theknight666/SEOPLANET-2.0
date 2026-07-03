import os
import sys
from huggingface_hub import HfApi, create_repo

def deploy_to_hf(token, space_name):
    api = HfApi(token=token)
    
    print(f"Creating Space '{space_name}' on Hugging Face...")
    repo_url = create_repo(
        repo_id=space_name,
        repo_type="space",
        space_sdk="docker",
        token=token,
        exist_ok=True,
        private=True
    )
    
    print(f"Space created at {repo_url}")
    print("Uploading backend files...")
    
    # Path to the backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    # Upload the folder
    api.upload_folder(
        folder_path=backend_dir,
        repo_id=space_name,
        repo_type="space",
        token=token,
        commit_message="Deploy backend to Hugging Face Spaces"
    )
    
    print("Deployment completed successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python deploy_hf.py <HF_TOKEN> <SPACE_NAME>")
        sys.exit(1)
    
    hf_token = sys.argv[1]
    hf_space_name = sys.argv[2]
    
    deploy_to_hf(hf_token, hf_space_name)
