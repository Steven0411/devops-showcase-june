moved {
  from = aws_eip_association.static_ip_assoc
  to   = aws_eip_association.server_static_ip_assoc
}

moved {
  from = aws_security_group.app_sg
  to   = aws_security_group.server_sg
}
moved {
  from = aws_instance.test_instance
  to   = aws_instance.server_instance
}