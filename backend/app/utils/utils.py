import boto3
import os
from dotenv import load_dotenv

load_dotenv(override=True)
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")


def upload_file_to_s3(access_key_id, secret_access_key, bucket_name, object_key, object, endpoint_url=S3_ENDPOINT_URL):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            endpoint_url=endpoint_url
        )

        s3.upload_fileobj(object, bucket_name, object_key)
        s3.put_object_acl(ACL='public-read', Bucket=bucket_name, Key=object_key)
        
        return True  

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def delete_file_from_s3(access_key_id, secret_access_key, bucket_name, object_key, endpoint_url=S3_ENDPOINT_URL):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            endpoint_url=endpoint_url
        )

        s3.delete_object(Bucket=bucket_name, Key=object_key)
        return True

    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    