from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired, ValidationError


class SearchForm(FlaskForm):
    search_item = StringField("Time", validators=[InputRequired()])
    submit = SubmitField("Submit")

    def validate_search_item(FlaskForm, field):
        if len(field.data) > 30:
            raise ValidationError("this field must be under 31 chars")
