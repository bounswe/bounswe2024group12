# Generated by Django 5.1.4 on 2024-12-16 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0005_alter_annotation_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='annotation',
            name='body_format',
        ),
        migrations.RemoveField(
            model_name='annotation',
            name='body_value',
        ),
        migrations.RemoveField(
            model_name='annotation',
            name='fen',
        ),
        migrations.RemoveField(
            model_name='annotation',
            name='move_number',
        ),
        migrations.AddField(
            model_name='annotation',
            name='body',
            field=models.JSONField(default={'format': 'text/plain', 'type': 'TextualBody', 'value': 'Default annotation'}),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='annotation',
            name='target',
            field=models.JSONField(default={'source': 'http://example.com/games/0', 'state': {'fen': 'startpos', 'moveNumber': 0}, 'type': 'ChessPosition'}),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='annotation',
            name='type',
            field=models.CharField(default='Annotation', max_length=50),
        ),
        migrations.AlterField(
            model_name='annotation',
            name='motivation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
