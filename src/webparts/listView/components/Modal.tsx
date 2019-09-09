import * as React from "react";
import { Button, Modal } from "react-bootstrap";

export const CustomModal = props => (
  <>
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.item.Title} Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Last Name: </strong>
            {props.item.Title}
          </li>
          <li className="list-group-item">
            <strong>First Name: </strong>
            {props.item.first_name}
          </li>
          <li className="list-group-item">
            <strong>Email: </strong>
            {props.item.email}
          </li>
          <li className="list-group-item">
            <strong>Department: </strong>
            {props.item.department}
          </li>
          <li className="list-group-item">
            <strong>Gender: </strong>
            {props.item.gender}
          </li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);
