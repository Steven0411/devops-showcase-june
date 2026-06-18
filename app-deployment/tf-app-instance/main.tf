# create ec2 instance

# specify provider/cloud
provider "aws" {
    region = var.default_region
}
# gets key names
data "aws_key_pair" "showcase_team" {
  for_each = toset(var.team_aws_key_names)
  key_name = each.value
  include_public_key = true
}

resource "aws_security_group" "app_sg"{
    name = var.security_group_name
    description = var.security_group_name

    ingress {
        from_port = var.ssh_port
        to_port = var.ssh_port
        protocol = "tcp"
        cidr_blocks =   [var.source_cidr_blocks]
    }
    ingress {
        from_port = var.http_port
        to_port = var.http_port
        protocol = "tcp" 
        cidr_blocks = [var.source_cidr_blocks]
    }
    ingress {
        from_port = var.grafana_port
        to_port = var.grafana_port
        protocol = "tcp" 
        cidr_blocks = [var.source_cidr_blocks]
    }
     ingress {
        from_port = var.prometheus_port
        to_port = var.prometheus_port
        protocol = "tcp" 
        cidr_blocks = [var.source_cidr_blocks]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = [var.source_cidr_blocks]
    }
}
#create  ec2 instance
resource "aws_instance" "app_instance" {
    # specify AMI id (Ubuntu 24.04 LTS)
    ami = var.ubuntu24_ami_id
    instance_type = var.instance_size
    associate_public_ip_address = true
    subnet_id = var.default_public_subnet_id 
    key_name = var.my_key_pair
    vpc_security_group_ids  = [aws_security_group.app_sg.id]
    root_block_device {
    volume_size           = 20       
    volume_type           = "gp3"    
    delete_on_termination = true
  }
    user_data = templatefile("${path.module}/user-data.tftpl", {
    public_keys = [for k in data.aws_key_pair.showcase_team : k.public_key]
  })
    tags = {
        Name = var.instance_name_tag
    }

}
# gives static ip from Ramon's jenkins server 2
resource "aws_eip_association" "static_ip_assoc" {
  instance_id   = aws_instance.app_instance.id 
  allocation_id = "eipalloc-04af77e9998fba023" 
}
