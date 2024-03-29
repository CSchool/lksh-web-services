import { fetchBackend, postBackend, deleteBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FormatDate } from '../Utils/Utils';
import { MultilineText } from '../Controls/MultilineText';
import Form from 'react-bootstrap/Form';
import PausedButton from '../Controls/PausedButton';
import MessageBody from './MessageBody';

function Comment(props) {
    return (
        <Row>
            <Col xs="auto">
                <Row className="mt-1">
                    <img src={props.comment.owner_picture} alt="" style={{maxWidth:128,}}/>
                </Row>
                <Row className="mt-1">
                    <Col xs="auto">{props.comment.owner_first_name + " " + props.comment.owner_last_name}</Col>
                </Row>
                <Row className="mt-1">
                    <Col>{FormatDate(props.comment.created)}</Col>
                </Row>
            </Col>
            <Col>
            <Row className="mt-3">
                <Col style={{wordWrap:"break-word"}}><MultilineText text={props.comment.body} /></Col>
            </Row>
            </Col>
        </Row>
    );
}

export default function ViewPost(props) {
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const fetchPost = () => {
        fetchBackend("posts/" + props.match.params.id + "/", {},
            setPost);
    };

    const fetchComments = () => {
        fetchBackend("comments/", {post:props.match.params.id},
            setComments);
    };

    const handleInput = (event) => {
        setComment(event.target.value);
    };

    const handleConfirm = () => {
        postBackend("comments/", {}, {post:props.match.params.id, body:comment},
            () => {
                setComment('');
                fetchComments();
            });
    }

    const handleDelete = () => {
        deleteBackend("posts/" + props.match.params.id + "/", {},
            () => {
                props.history.push("/");
            });
    }

    useEffect(() => {
        fetchPost();
        fetchComments();
        // eslint-disable-next-line
    }, []);

    if (!post || !post.id)
        return "";

    return (
        <Container>
            <Row><Col style={{wordWrap:"break-word"}}><h2>{post.title}</h2></Col></Row>
            <MessageBody {...post} />
            {props.auth.is_staff
                ? <Row><Col>
                    <PausedButton onClick={handleDelete}
                        variant="outline-danger">
                        {"Удалить запись"}
                    </PausedButton>
                  </Col></Row>
                : ""}
            <h3>{"Комментарии"}</h3>
            {props.auth.isAuthenticated
                ? <>
                    <Form.Group as={Row} className="mt-3">
                        <Col>
                            <Form.Control as="textarea" id="body"
                                onChange={handleInput}
                                value={comment}
                                rows={4}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-3">
                        <Col>
                            <PausedButton onClick={handleConfirm} confirm={false}
                                disabled={comment===""}>
                                {"Написать"}
                            </PausedButton>
                        </Col>
                    </Form.Group>
                  </>
                : ""
            }
            {comments.map(c => <Comment key={c.id} comment={c} />)}
        </Container>
    );
};
