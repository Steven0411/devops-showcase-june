# create ec2 instance

# specify provider/cloud
provider "aws" {
    region = var.default_region
}

# Makes get request to that url
data "http" "my_ipv4" {
  url = "https://ipv4.icanhazip.com"
}

resource "aws_security_group" "app_sg"{
    name = var.security_group_name
    description = var.security_group_name

    ingress {
        from_port = var.port_1
        to_port = var.port_1
        protocol = "tcp"
        cidr_blocks =   ["${chomp(data.http.my_ipv4.response_body)}/32"]
    }
    ingress {
        from_port = var.port_2
        to_port = var.port_2
        protocol = "tcp" 
        cidr_blocks = [var.source_cidr_blocks]
    }
    ingress {
        from_port = var.port_4
        to_port = var.port_4
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
resource "aws_instance" "test_instance" {
    # specify AMI id (Ubuntu 24.04 LTS)
    ami = var.ubuntu24_ami_id
    instance_type = var.instance_size
    associate_public_ip_address = true
    subnet_id = var.default_public_subnet_id 
    key_name = var.my_key_pair
    #user_data = file("${path.module}/${var.user_data_file}")
    vpc_security_group_ids  = [aws_security_group.app_sg.id]
   
    root_block_device {
    volume_size           = var.disk_size 
    volume_type           = "gp3"
    delete_on_termination = true
    }
    tags = {
        Name = var.instance_name_tag
    }

}
resource "aws_eip_association" "static_ip_assoc" {
  instance_id   = aws_instance.test_instance.id  # Make sure this matches your actual instance resource name
  allocation_id = "eipalloc-0d1dbe0e01eb6f223" 
}
