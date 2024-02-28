from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class DirectRoomForm(FlaskForm):
    # owner_1_id = IntegerField('owner_1_id', validators=[DataRequired()])
    owner_2_id = IntegerField('owner_2_id', validators=[DataRequired()])
