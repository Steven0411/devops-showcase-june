output "elastic_ip" {
  # Or output just the clean numbers:
  value = aws_eip_association.static_ip_assoc.public_ip
}