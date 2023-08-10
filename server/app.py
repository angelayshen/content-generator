#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request, session

from config import app, db
from models import Story, User

import os
openai_api_key = os.getenv('OPENAI_API_KEY')
# print("OPENAI_API_KEY from environment:", os.getenv('OPENAI_API_KEY'))

import openai
openai.api_key = openai_api_key

# Make API request to generate text

@app.post('/generateStory')
def generate_story():
    data = request.get_json()
    story_type = data.get('storyType')
    prompt = data.get('prompt')

    if not story_type or not prompt:
        return make_response(
            jsonify({"error": "Missing storyType or prompt"}),
            400
        )

    try:
        messages = [{"role": "user", "content": f"Write a {story_type} about {prompt}."}]
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1000
        )

        story = completion.choices[0].message.content

        return make_response(
            jsonify({"content": story}),
            200
        )
    except Exception as e:
        print(e)
        return make_response(
            jsonify({"error": "Error generating story"}),
            500
        )

# Make API request to generate image

@app.post('/generateImage')
def generate_image():
    data = request.get_json()
    imagePrompt = data.get('imagePrompt')

    if not imagePrompt:
        return make_response(
            jsonify({"error": "Missing prompt"}),
            400
        )

    try:
        response = openai.Image.create(
            prompt = f"Oil painting of {imagePrompt}",
            n = 1,
            size = "512x512",
            response_format = "b64_json" # Set the response format to Base64
        )

        image_base64 = response['data'][0]['b64_json'] 

        return make_response(
            jsonify({"image_base64": image_base64}),
            200
        )
    except Exception as e:
        print(e)
        return make_response(
            jsonify({"error": "Error generating image"}),
            500
        )

@app.get('/stories')
def get_stories():
    stories = Story.query.all()
    story = [story.to_dict() for story in stories]
    return make_response(
        jsonify(story),
        200
    )

@app.get('/users/<int:user_id>/stories')
def get_stories_by_user_id(user_id):
    stories = Story.query.filter(Story.user_id == user_id).all()
    data = [story.to_dict() for story in stories]
    return make_response(
        jsonify(data), 
        200
    )

@app.get('/stories/<string:content_type>')
def get_stories_by_content_type(content_type):
    stories = Story.query.filter(Story.content_type == content_type).all()
    data = [story.to_dict() for story in stories]
    
    return make_response(
        jsonify(data), 
        200
    )

@app.post('/stories')
def post_story():
    data = request.get_json()

    try:
        new_story = Story(
            title = data.get('title'),
            content = data.get('content'),
            content_type = data.get('content_type'),
            image_base64 = data.get('image_base64'),
            user_id = data.get('user_id')
        )

        db.session.add(new_story)
        db.session.commit()

        return make_response(
            jsonify(new_story.to_dict()),
            201
        )
    except ValueError:
        return make_response(
            jsonify({"errors": ["validation errors"]}), 
            400
        )

@app.get('/stories/<int:id>')
def get_story_by_id(id):
    story = Story.query.filter(Story.id==id).first()

    if not story:
        return make_response(
            jsonify({"error": "story not found"}),
            404
        )

    return make_response(
        jsonify(story.to_dict()),
        200
    )

@app.delete('/stories/<int:id>')
def delete_story_by_id(id):
    story = Story.query.filter(Story.id==id).first()

    if not story:
        return make_response(
            jsonify({"error": "story not found"}),
            404
        )

    db.session.delete(story)
    db.session.commit()

    return make_response(
        jsonify({}),
        202
    )

@app.patch('/stories/<int:id>')
def patch_story_by_id(id):
    story = Story.query.filter(Story.id==id).first()

    if not story:
        return make_response(
            jsonify({"error": "story not found"}),
            404
        )

    data = request.get_json()

    try:
        for attr in data:
            setattr(story, attr, data[attr])

        db.session.add(story)
        db.session.commit()

        return make_response(
            jsonify(story.to_dict()),
            200
        )
    except ValueError:
        return make_response(
            jsonify({"errors": ["validation errors"]}), 
            400
        )

@app.post('/signup')
def signup():
    # get json from request
    data = request.get_json()

    try:
        # create new user using json data
        new_user = User(
            username=data['username']
        )
        new_user.password_hash=data['password']

        # add user to db
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        print(e)
        return {'error': 'Error creating user'}, 422

    # add user_id cookie
    session['user_id'] = new_user.id

    # return user as JSON, status code 201
    return new_user.to_dict(), 201

@app.post('/login')
def login():
    # get JSON from request
    data = request.get_json()
    # query db by username
    user = User.query.filter(
        User.username == data['username']
    ).first()
    
    if not user or not user.authenticate(data['password']):
        # user doesn't exist or password doesn't match, return 401
        return {'errors': ['Login failed: incorrect username or password']}, 401
    
    # login success, add cookie to browser
    session['user_id'] = user.id
    return user.to_dict(), 201

@app.delete('/logout')
def logout():
    # check if user_id cookie is set
    user_id = session.get('user_id')

    if not user_id:
        # no cookie is set, return 401
        return {'error': 'User is not logged in'}, 401
    
    # delete the cookie
    session.pop('user_id')
    # return 204 (no content)
    return {}, 204

@app.get('/check_session')
def check_session():
    # get user_id from browser cookies
    user_id = session.get('user_id')
    # check for user in db
    user = User.query.filter(User.id == user_id).first()

    if not user:
        # user doesn't exist, return 401 (unauthorized)
        return {'error': 'Unauthorized'}, 401
    
    # user exists, return user as JSON, status code 200
    return user.to_dict(), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)