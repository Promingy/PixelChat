from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired

class MessageForm(FlaskForm):
    body = StringField('body', validators=[DataRequired()])
    pinned = BooleanField('pinned')
