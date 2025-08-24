terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" { 
  type = string
  default = "us-east-1" 
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

data "aws_caller_identity" "current" {}
