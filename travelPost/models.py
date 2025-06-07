from django.db import models
from signin.models import User

# Create your models here.
class Region(models.Model):
    region = models.CharField(max_length=15)

    def __str__(self):
        return self.region

class Subregion(models.Model):
    subregion = models.CharField(max_length=15)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.region} {self.subregion}"

class Post(models.Model):
    title = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=1, null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    status = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.user_id} - {self.title or '제목 없음'}"

class PostImage(models.Model):
    image_url = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')

    def __str__(self):
        return f"image post.id: {self.post.id}"


class PostSubregion(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_subregions')
    subregion = models.ForeignKey(Subregion, on_delete=models.CASCADE, related_name='subregion_posts')

    def __str__(self):
        return f"Post {self.post.id} - {self.subregion.subregion}"