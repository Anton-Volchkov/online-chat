import { Component, OnInit, Inject } from "@angular/core";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import { ChatUser } from "../Models/ChatUser";
import { UserProfile } from "../Models/UserProfile";
import { UserService } from "../shared/user.service";
import { Message } from "../Models/Message";
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public currentUser: UserProfile;

  private onlineUsers: ChatUser[] = [];
  public currentOnlineUsers: ChatUser[] = [];

  private allUsers: ChatUser[] = [];
  public currentAllUsers: ChatUser[] = [];

  public Messages: Message[] = [];
  public recipientUser: ChatUser;
  public _hubConnection: HubConnection;
  public onlyOnlineUser: boolean = true;

  constructor(
    private service: UserService,
    @Inject("SERVER_URL") private serverUrl: string,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recipientUser = new ChatUser();
    var userID = this.service.GetUserID();

    this.service.GetUserInfo(userID).subscribe((data) => {
      this.currentUser = data;
      this.currentUser.fullName = `${data.firstName} ${data.lastName}`;

      this.createConnection();
      this.registerOnServerEvents();
      this.startConnection();
    });

    this.service.GetAllUsersInfo().subscribe((data) => {
      this.allUsers = data;
      this.currentAllUsers = this.allUsers;
    });

  }

  private createConnection() {
    // https://localhost:44358/server  https://mutual-like-server.herokuapp.com/server
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.serverUrl + "/chat", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this._hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this._hubConnection.start().then(
      () => {
        console.log("Hub connection started!");
        this._hubConnection.invoke("Join", this.currentUser.fullName);
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on("OnlineUsers", (data: ChatUser[]) => {
      const elem = data.find((x) => x.userID == this.currentUser.userID);
      if (elem != null) {
        const index = data.indexOf(elem);
        if (index > -1) {
          data.splice(index, 1);
        }
      }

      this.onlineUsers = data;
      this.currentOnlineUsers = this.onlineUsers;

      var filter = (<HTMLInputElement>(
        document.getElementById("FilterUserName")
      )).value.trim();

      if (filter != "" && this.onlyOnlineUser) this.filterUsers(filter);
    });

    this._hubConnection.on("NewMessage", (data: Message) => {
      if (
        data.recipientID != this.currentUser.userID ||
        data.senderID != this.recipientUser.userID
      )
      {
       var userOnline = this.onlineUsers.find(
          (x) => x.userID == data.senderID
        );

        if(userOnline)
        {
          userOnline.haveUnreadDialog = true;
        }

        var userInAllList = this.allUsers.find(
          (x) => x.userID == data.senderID
        );

        if(userInAllList)
        {
          userInAllList.haveUnreadDialog = true;
        }

        var audio = new Audio('../../assets/Sounds/new-msg.mp3'); // Создаём новый элемент Audio
     
        audio.play();
         
        return;
      }

    
      this.Messages.push(data);

      console.log(data.senderID);
      this._hubConnection.invoke("ReadDialog", this.recipientUser.userID);

      setTimeout(() => {
        let elem = document.getElementById("data");

        elem.scrollTop = elem.scrollHeight;
      }, 1);
    });
  }

  
  setRecipient(user: ChatUser) {
    if (this.recipientUser.userID == user.userID) return;

    var userOnline = this.onlineUsers.find(
      (x) => x.userID == user.userID
    );

    if(userOnline)
    {
      userOnline.haveUnreadDialog = false;
    }

    var userInAllList = this.allUsers.find(
      (x) => x.userID == user.userID
    );

    if(userInAllList)
    {
      userInAllList.haveUnreadDialog = false;
    }

    this.recipientUser = user;
    this.Messages = [];
    this.http
      .get<Message[]>(
        this.serverUrl + "/Message/GetChatHistory/" + this.recipientUser.userID
      )
      .subscribe((data) => {
        this.Messages = data;
        
        this._hubConnection.invoke("ReadDialog", user.userID);
        setTimeout(() => {
          let elem = document.getElementById("data");

          elem.scrollTop = elem.scrollHeight;
        }, 1);
      });
  }

  sendMessage(form: NgForm) {
    var formValue = form.value;
    if (formValue.message.trim() == "") {
      form.reset();
      return;
    }
    var date = this.getDate();

    var msg = new Message();
    msg.senderID = this.currentUser.userID;
    msg.recipientID = this.recipientUser.userID;
    msg.fullNameSender = this.currentUser.fullName;
    msg.textMessage = formValue.message;
    msg.dispatchTime = date;

    form.reset();
    document.getElementById("areaMessage").focus();

    this.Messages.push(msg);

    this._hubConnection.invoke(
      "SendMessage",
      this.recipientUser.userID,
      msg.textMessage
    );

    setTimeout(() => {
      let elem = document.getElementById("data");

      elem.scrollTop = elem.scrollHeight;
    }, 1);
  }

  getDate(): string {
    var date = new Date();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
  }

  ChangeList(needtList: string) {
    if (
      (needtList == "Online" && this.onlyOnlineUser) ||
      (needtList == "All" && this.onlyOnlineUser == false)
    )
      return;

    this.onlyOnlineUser = !this.onlyOnlineUser;

    var filter = (<HTMLInputElement>(
      document.getElementById("FilterUserName")
    )).value.trim();

    if (filter != "") this.filterUsers(filter);
  }

  filterUsers(filterValue: string) {
    var userName = filterValue.toLowerCase().trim();
    if (userName == "") {
      this.currentOnlineUsers = this.onlineUsers;
      this.currentAllUsers = this.allUsers;
      return;
    }

    if (this.onlyOnlineUser && this.onlineUsers.length > 0) {
      this.currentOnlineUsers = this.onlineUsers.filter(
        (x) => x.fullName.toLowerCase() == userName
      );
    } else if (!this.onlyOnlineUser && this.allUsers.length > 0) {
      this.currentAllUsers = this.allUsers.filter(
        (x) => x.fullName.toLowerCase() == userName
      );
    }
  }
}
