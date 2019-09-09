import * as React from 'react';
import styles from './ListView.module.scss';
import { IListViewProps } from './IListViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Button, Table, Pagination } from "react-bootstrap";
import { FaSearch, FaEye } from "react-icons/fa";
import { CustomModal } from "./Modal";
interface ListViewState {
  show: boolean;
}

export default class ListView extends React.Component<IListViewProps, ListViewState> {
  constructor(props: IListViewProps) {
    super(props);
    this.state = { show: false };
  }

  private handleClose = () => this.setState({ show: false });
  private handleShow = () => this.setState({ show: true });

  public render(): React.ReactElement<IListViewProps> {
    return (
      <>
        <div className="container">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search Items" />
            <div className="input-group-append">
              <button className="btn btn-secondary" type="button">
                <FaSearch />
              </button>
            </div>
          </div>
          <Table striped bordered hover className="mt-5">
            <thead>
              <tr>
                <th>View</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.hover} onClick={this.handleShow}><FaEye></FaEye></td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td><FaEye></FaEye></td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td><FaEye></FaEye></td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
          <div className="text-center">
          <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
          </div>
          
        </div>
        <Button variant="primary" onClick={this.handleShow}>
          Launch demo modal
        </Button>
        <CustomModal show={this.state.show} handleClose={this.handleClose} />
      </>
    );
  }
}
