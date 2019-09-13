import * as React from "react";
import { IListViewProps } from "./IListViewProps";
import { Table, Pagination } from "react-bootstrap";
import { FaSearch, FaEye } from "react-icons/fa";
import { CustomModal } from "./Modal";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
require("./style.css");

interface ListViewState {
  show: boolean;
  pageNumber: number;
  searchQuery: string;
  selectedItem?: any;
  itemCount?: number;
  items: any[];
  pageSize: number;
  nextLink: string;
  prevLink: string[];
  currentUrl: string;
}

export default class ListView extends React.Component<
  IListViewProps,
  ListViewState
> {
  constructor(props: IListViewProps) {
    super(props);
    this.state = {
      show: false,
      pageNumber: 1,
      searchQuery: "",
      selectedItem: {},
      items: [],
      pageSize: 10,
      nextLink: "",
      prevLink: [`${this.props.siteUrl}/_api/web/lists/GetByTitle('${props.listName}')/items?$top=10`],
      currentUrl: `${this.props.siteUrl}/_api/web/lists/GetByTitle('${props.listName}')/items?$top=10`
    };
    this.getListItemsCount(
      `${this.props.siteUrl}/_api/web/lists/GetByTitle('${props.listName}')/ItemCount`
    );
    this.readItems(
      `${this.props.siteUrl}/_api/web/lists/GetByTitle('${props.listName}')/items?$top=${this.state.pageSize}`
    );

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleClose = () => this.setState({ show: false });
  private handleShow = item => {
    console.log("item clicked", item);
    this.setState({ show: true, selectedItem: item });
  };
  private handleNext = () => {
    console.log('State At next', this.state);
    var prev = this.state.prevLink;
    prev.push(this.state.nextLink);
    this.setState({ pageNumber: this.state.pageNumber + 1, prevLink: prev });
    this._onPageUpdate(this.state.pageNumber + 1, true);
  };
  private handlePrev = () => {
    var prev = this.state.prevLink;
    if(this.state.currentUrl == this.state.prevLink[this.state.prevLink.length -1])prev.pop();
    this.setState({
      pageNumber: this.state.pageNumber > 1 ? this.state.pageNumber - 1 : 1,
      prevLink: prev
    });
    this.state.pageNumber > 1
      ? this._onPageUpdate(this.state.pageNumber - 1, false)
      : "";
  };

  private _onPageUpdate(pageNumber: number, isNext: boolean) {
    console.log("Current page", pageNumber);
    var prev = this.state.prevLink;

    console.log('State on page update: ', this.state)
    var url = isNext ? this.state.nextLink : prev.pop();
    if(!isNext) this.setState({prevLink: prev});
    this.readItems(url);
  }

  private onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value } as ListViewState);
  }
  private buildFilter(){
    const filter = this.state.searchQuery
      ? `&$filter=substringof('${this.state.searchQuery}',Title) or substringof('${this.state.searchQuery}',first_name) or substringof('${this.state.searchQuery}',department)`
      : "";
      return filter;
  }
  private handleSubmit(event) {
    event.preventDefault();
    const filter = this.buildFilter();
    var prev = [`${this.props.siteUrl}/_api/web/lists/GetByTitle('${this.props.listName}')/items?$top=${this.state.pageSize}${filter}`];

    this.setState({nextLink: '', prevLink: prev, pageNumber: 1});

    this.readItems(
      `${this.props.siteUrl}/_api/web/lists/GetByTitle('${this.props.listName}')/items?$top=${this.state.pageSize}${filter}`
    );
  }

  private getListItemsCount(url: string) {

    this.props.spHttpClient
      .get(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then(
        (response: SPHttpClientResponse): Promise<{ value: number }> => {
          return response.json();
        }
      )
      .then((response: { value: number }): void => {
        console.log("Number of items: ", response.value);
        this.setState({
          itemCount: response.value
        });
      });
  }

  private readItems(url: string) {
    this.setState({
      items: [],
      currentUrl: url
    });
    this.props.spHttpClient
      .get(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then(
        (response: SPHttpClientResponse): Promise<{ value: any[] }> => {
          return response.json();
        }
      )
      .then(
        (response: any): void => {
          console.log("List items: ", response);
          //this.props.siteUrl = response['odata.nextLink'];
          this.setState({
            items: response.value,
            nextLink: response["odata.nextLink"]
          });
          console.log('State ', this.state);
        },
        (error: any): void => {
          console.error("Error happened: ", error);
          this.setState({
            items: []
          });
        }
      );
  }

  public render(): React.ReactElement<IListViewProps> {
    const listItems = this.state.items.map(item => (
      <tr key={item.ID}>
        <td className="tableHover" onClick={() => this.handleShow(item)}>
          <FaEye></FaEye>
        </td>
        <td>{item.first_name}</td>
        <td>{item.Title}</td>
        <td>{item.department}</td>
      </tr>
    ));
    return (
      <>
        <div className="container">
          <div className="input-group">
            <input
              type="text"
              name="searchQuery"
              className="form-control"
              value={this.state.searchQuery}
              onChange={this.onChange}
              placeholder="Search Items"
            />
            <div className="input-group-append">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={this.handleSubmit}
              >
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
                <th>Department</th>
              </tr>
            </thead>
            <tbody>{listItems}</tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => this.setState({ pageNumber: 1 })}
                disabled={this.state.pageNumber == 1}
              />
              <Pagination.Prev
                onClick={this.handlePrev}
                disabled={this.state.pageNumber == 1}
              />
              <Pagination.Item disabled={true}>Page {this.state.pageNumber}</Pagination.Item>
              <Pagination.Next
                onClick={this.handleNext}
                disabled={
                  this.state.nextLink == "" || this.state.nextLink == undefined
                }
              />
              <Pagination.Last
                disabled={
                  this.state.nextLink == "" || this.state.nextLink == undefined
                }
              />
            </Pagination>
          </div>
        </div>

        <CustomModal
          show={this.state.show}
          handleClose={this.handleClose}
          item={this.state.selectedItem}
        />
      </>
    );
  }
}
