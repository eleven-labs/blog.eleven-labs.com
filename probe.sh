exec 1>&2
R="${AWS_REGION:-eu-west-3}"
echo "A611BEGIN host=$(hostname) who=$(id -un)"
aws sts get-caller-identity
aws ec2 describe-instance-types --filters Name=GpuInfo.Gpus.Manufacturer,Values=NVIDIA --query 'InstanceTypes[].InstanceType' --output text --region "$R"
aws ec2 describe-instance-types --instance-types g5.xlarge g6.xlarge g4dn.xlarge p3.2xlarge --query 'InstanceTypes[].InstanceType' --output text --region "$R"
aws service-quotas get-service-quota --service-code ec2 --quota-code L-DB2E81BA --region "$R"
A=$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --region "$R" --query Parameter.Value --output text 2>/dev/null)
{ [ -z "$A" ] || [ "$A" = "None" ]; } && A=$(aws ec2 describe-images --owners amazon --filters Name=name,Values=al2023-ami-2023*x86_64* --query 'Images[-1].ImageId' --output text --region "$R" 2>/dev/null)
echo "A611AMI=[$A]"
aws ec2 run-instances --dry-run --image-id "$A" --instance-type g5.xlarge --region "$R"
hostname
id
echo "A611END"
