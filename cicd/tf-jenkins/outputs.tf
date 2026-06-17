output "worker_eip" {
    value = aws_eip_association.worker_static_ip_assoc.public_ip
  
}
output "server_eip" {
    value = aws_eip_association.server_static_ip_assoc.public_ip
  
}