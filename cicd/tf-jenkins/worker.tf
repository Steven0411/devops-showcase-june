resource "aws_security_group" "worker_sg"{
    name = var.worker_security_group_name
    description = var.worker_security_group_name

    ingress {
        from_port = var.port_1
        to_port = var.port_1
        protocol = "tcp"
        cidr_blocks =   ["${chomp(data.http.my_ipv4.response_body)}/32", "${aws_eip_association.server_static_ip_assoc.public_ip}/32"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = [var.source_cidr_blocks]
    }
}
#create  ec2 instance
resource "aws_instance" "worker_instance" {
    # specify AMI id (Ubuntu 24.04 LTS)
    ami = var.ubuntu24_ami_id
    instance_type = var.instance_size
    associate_public_ip_address = true
    subnet_id = var.default_public_subnet_id 
    key_name = var.my_key_pair
    #user_data = file("${path.module}/install-java.sh")
    vpc_security_group_ids  = [aws_security_group.worker_sg.id]
   
    root_block_device {
    volume_size           = var.disk_size 
    volume_type           = "gp3"
    delete_on_termination = true
    }
    tags = {
        Name = var.worker_name_tag
    }
}
resource "aws_eip_association" "worker_static_ip_assoc" {
  instance_id   = aws_instance.worker_instance.id 
  allocation_id = "eipalloc-0700fa8cddf5160e1" 
}
