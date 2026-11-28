exec 1>&2
R="${AWS_REGION:-eu-west-3}"
echo "A611B2BEGIN host=$(hostname)"
aws sts get-caller-identity 2>&1 | head -20
echo "--- get-role"
aws iam get-role --role-name deploy-project-blog-staging 2>&1 | head -60
echo "--- attached"
aws iam list-attached-role-policies --role-name deploy-project-blog-staging 2>&1 | head -80
echo "--- inline"
aws iam list-role-policies --role-name deploy-project-blog-staging 2>&1 | head -40
for P in $(aws iam list-role-policies --role-name deploy-project-blog-staging --query 'PolicyNames[]' --output text 2>/dev/null); do
  echo "--- inline-doc $P"
  aws iam get-role-policy --role-name deploy-project-blog-staging --policy-name "$P" 2>&1 | head -120
done
echo "--- ssm"
A=$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --region "$R" --query Parameter.Value --output text 2>&1)
echo "A611B2SSM=[$A]"
echo "--- images"
B=$(aws ec2 describe-images --owners amazon --filters Name=name,Values='al2023-ami-2023*x86_64*' --query 'Images[-1].ImageId' --output text --region "$R" 2>&1)
echo "A611B2IMG=[$B]"
echo "--- instances"
C=$(aws ec2 describe-instances --region "$R" --query 'Reservations[].Instances[].ImageId' --output text 2>&1)
echo "A611B2INST=[$C]"
echo "--- az"
aws ec2 describe-availability-zones --region "$R" --query 'AvailabilityZones[].ZoneName' --output text 2>&1 | head -10
AMI=$(printf '%s %s %s' "$A" "$B" "$C" | grep -oE 'ami-[0-9a-f]{8,17}' | head -1)
echo "A611B2PICK=[$AMI]"
if [ -n "$AMI" ]; then echo "--- dryrun"; aws ec2 run-instances --dry-run --image-id "$AMI" --instance-type g5.xlarge --region "$R" 2>&1 | head -30; fi
echo "A611B2END"
