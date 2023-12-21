from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class ChannelForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description')
    topic = StringField('topic')
