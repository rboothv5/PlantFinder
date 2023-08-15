# PlantFinder

The Plant Finder application enables an image of an unknown plant to be uploaded and compared against an ONNX (Open Neural Network Exchange) model which has been trained to predict the specific plant name. The model 
currently holds 10 plants which can be compared against. Users can upload their own image or select from a list of sample images provided in the application. A preview of the image and location (if the GPS metadata of the image is available) appears once a user has uploaded an image. 

After initiating the identification process and the outcome is produced, a list of reference images is displayed along with the predicted score relative to the original uploaded image. The plant with the highest score is the closest match to the current trained images in the model. The comparison results together with user information, comments and the uploaded image can optionally be saved to a PostgreSQL database and S3 storage bucket hosted in AWS. 

The application is containerized and is launched using Docker Compose which orchestrates and enables the sharing of multiple containers within the application. There are 5 containers:
  • Frontend
  • Backend
  • Postgres
  • Nginx – Reverse proxy enabling the application to map to port 80 instead of the default React port of 3000.
  • Certbot – Enables signed SSL certificates to be used and redirects traffic from http to https for added security.

Technology stack

Frontend:
  • React
  • HTML5
  • CSS3
  • JavaScript

Backend:
  • Django
  • Python

AWS:
  • EC2
  • Lambda
  • S3
  • Route53
  • API Gateway
  • RDS (PostgreSQL)

DevOps:
  • Docker
  • Git
