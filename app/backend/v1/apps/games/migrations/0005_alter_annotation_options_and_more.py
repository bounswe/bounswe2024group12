# Generated by Django 5.1.4 on 2024-12-16 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0004_annotation'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='annotation',
            options={'ordering': ['-created']},
        ),
        migrations.RenameField(
            model_name='annotation',
            old_name='created_at',
            new_name='created',
        ),
        migrations.RenameField(
            model_name='annotation',
            old_name='modified_at',
            new_name='modified',
        ),
        migrations.RemoveField(
            model_name='annotation',
            name='target_fen',
        ),
        migrations.AddField(
            model_name='annotation',
            name='fen',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='annotation',
            name='move_number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]