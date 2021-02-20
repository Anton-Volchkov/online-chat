import { Component, OnInit, Inject, NgZone, ViewChild } from "@angular/core";
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
import { environment } from "src/environments/environment";
import { MatMenuTrigger } from "@angular/material/menu";
import { BlackListDataModel } from "../Models/BlackListDataModel";
import { from } from "rxjs";
import { mergeMap, toArray } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  @ViewChild("messageContext")
  messageContext: MatMenuTrigger;

  public currentUser: UserProfile;

  private onlineUsers: ChatUser[] = [];
  public currentOnlineUsers: ChatUser[] = [];

  private allUsers: ChatUser[] = [];
  public currentAllUsers: ChatUser[] = [];

  public chatImage: string = environment.production
    ? "/online-chat/assets/Images/chatImage.png"
    : "/assets/Images/chatImage.png";
  public Messages: Message[] = [];
  public recipientUser: ChatUser;
  public _hubConnection: HubConnection;
  public onlyOnlineUser: boolean = true;
  public dataLoaded: boolean = false;
  public clientX = "0px";
  public clientY = "0px";

  constructor(
    private service: UserService,
    @Inject("SERVER_URL") private serverUrl: string,
    private http: HttpClient,
    private zone: NgZone
  ) {
    this.zone.runOutsideAngular(() => {
      document.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
      });
    });
  }

  ngOnInit(): void {
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
    this._hubConnection.on("UnblockUser", (data: BlackListDataModel) => {
      if (this.currentUser.userID === data.userId) {
        this.service.GetChatUserInfo(data.blockUserId).subscribe((chatUser) => {
          let unblockUserInAllUsers = this.allUsers.find(
            (x) => x.userID == data.blockUserId
          );

          if (unblockUserInAllUsers) {
            unblockUserInAllUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInAllUsers.isBlocked = chatUser.isBlocked;
          }

          let unblockUserInOnlineUsers = this.onlineUsers.find(
            (x) => x.userID === data.blockUserId
          );

          if (unblockUserInOnlineUsers) {
            unblockUserInOnlineUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInOnlineUsers.isBlocked = chatUser.isBlocked;
          }
        });
      }

      if (this.currentUser.userID === data.blockUserId) {
        this.service.GetChatUserInfo(data.userId).subscribe((chatUser) => {
          let unblockUserInAllUsers = this.allUsers.find(
            (x) => x.userID === data.userId
          );

          if (unblockUserInAllUsers) {
            unblockUserInAllUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInAllUsers.isBlocked = chatUser.isBlocked;
          }

          let unblockUserInOnlineUsers = this.onlineUsers.find(
            (x) => x.userID === data.userId
          );

          if (unblockUserInOnlineUsers) {
            unblockUserInOnlineUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInAllUsers.isBlocked = chatUser.isBlocked;
          }
        });
      }
    });

    this._hubConnection.on("BlockUser", (data: BlackListDataModel) => {
      if (this.currentUser.userID === data.userId) {
        this.service.GetChatUserInfo(data.blockUserId).subscribe((chatUser) => {
          let unblockUserInAllUsers = this.allUsers.find(
            (x) => x.userID === data.blockUserId
          );

          if (unblockUserInAllUsers) {
            unblockUserInAllUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInAllUsers.isBlocked = chatUser.isBlocked;
          }

          let unblockUserInOnlineUsers = this.onlineUsers.find(
            (x) => x.userID === data.blockUserId
          );

          if (unblockUserInOnlineUsers) {
            unblockUserInOnlineUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInOnlineUsers.isBlocked = chatUser.isBlocked;
          }
        });
      }

      if (this.currentUser.userID === data.blockUserId) {
        this.service.GetChatUserInfo(data.userId).subscribe((chatUser) => {
          let unblockUserInAllUsers = this.allUsers.find(
            (x) => x.userID === data.userId
          );

          if (unblockUserInAllUsers) {
            unblockUserInAllUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInAllUsers.isBlocked = chatUser.isBlocked;
          }

          let unblockUserInOnlineUsers = this.onlineUsers.find(
            (x) => x.userID === data.userId
          );

          if (unblockUserInOnlineUsers) {
            unblockUserInOnlineUsers.canWriteMessage = chatUser.canWriteMessage;
            unblockUserInOnlineUsers.isBlocked = chatUser.isBlocked;
          }
        });
      }
    });

    this._hubConnection.on("OnlineUsers", (data: ChatUser[]) => {
      const elem = data.find((x) => x.userID == this.currentUser.userID);
      if (elem != null) {
        const index = data.indexOf(elem);
        if (index > -1) {
          data.splice(index, 1);
        }
      }

      from(data)
        .pipe(
          mergeMap((param) => this.service.GetChatUserInfo(param.userID)),
          toArray()
        )
        .subscribe((data) => {
          this.onlineUsers = data;
          this.currentOnlineUsers = this.onlineUsers;
        });

      var filter = (<HTMLInputElement>(
        document.getElementById("FilterUserName")
      )).value.trim();

      if (filter != "" && this.onlyOnlineUser) this.filterUsers(filter);
    });
    

    this._hubConnection.on("MessageDeleted", (msgId: number) => {
     this.Messages = this.Messages.filter(x=> x.id !== msgId);
    });

    this._hubConnection.on("NewMessage", (data: Message) => {
      if(data.senderID === this.currentUser.userID)
      {
        this.Messages.push(data);
        setTimeout(() => {
          let elem = document.getElementById("data");
    
          elem.scrollTop = elem.scrollHeight;
        }, 1);
        return;
      }

      if (
        !this.recipientUser ||
        data.recipientID != this.currentUser.userID ||
        data.senderID != this.recipientUser.userID
      ) {
        var userOnline = this.onlineUsers.find(
          (x) => x.userID == data.senderID
        );

        if (userOnline) {
          userOnline.haveUnreadDialog = true;
        }

        var userInAllList = this.allUsers.find(
          (x) => x.userID == data.senderID
        );

        if (userInAllList) {
          userInAllList.haveUnreadDialog = true;
        }

        var audio = new Audio("/online-chat/assets/Sounds/new-msg.mp3"); // Создаём новый элемент Audio

        audio.play();

        return;
      }

      this.Messages.push(data);

      this._hubConnection.invoke("ReadDialog", data.senderID);

      setTimeout(() => {
        let elem = document.getElementById("data");

        elem.scrollTop = elem.scrollHeight;
      }, 1);
    });
  }

  setRecipient(user: ChatUser) {
    if (this.recipientUser && this.recipientUser.userID == user.userID) return;
    this.recipientUser = user;

    var userOnline = this.onlineUsers.find((x) => x.userID == user.userID);

    if (userOnline) {
      userOnline.haveUnreadDialog = false;
    }

    var userInAllList = this.allUsers.find((x) => x.userID == user.userID);

    if (userInAllList) {
      userInAllList.haveUnreadDialog = false;
    }

    this.Messages = [];

    this.dataLoaded = false;

    this.http
      .get<Message[]>(
        this.serverUrl + "/Message/GetChatHistory/" + this.recipientUser.userID
      )
      .subscribe((data) => {
        this.Messages = data;

        this.dataLoaded = true;
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

    form.reset();
    document.getElementById("areaMessage").focus();

    this._hubConnection.invoke(
      "SendMessage",
      this.recipientUser.userID,
      formValue.message
    );
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
      this.currentOnlineUsers = this.onlineUsers.filter((x) =>
        x.fullName.toLowerCase().includes(userName)
      );
    } else if (!this.onlyOnlineUser && this.allUsers.length > 0) {
      this.currentAllUsers = this.allUsers.filter((x) =>
        x.fullName.toLowerCase().includes(userName)
      );
    }
  }

  public setCords(event, userID) {
    event.preventDefault();

    this.clientY = event.clientY + "px";
    this.clientX = event.clientX + "px";

    let user = this.allUsers.find((x) => x.userID === userID);

    this.contextMenu.menuData = {
      userId: userID,
      isBlocked: user.isBlocked,
    };

    this.contextMenu.openMenu();
  }

  public showMessagesContextMenu(event, msg: Message) {
    event.preventDefault();

    if(msg.senderID !== this.currentUser.userID)
    {
      return;
    }

    this.clientY = event.clientY + "px";
    this.clientX = event.clientX + "px";

    this.messageContext.menuData = {
      msgId: msg.id,
    };

    this.messageContext.openMenu();
  }

  public deleteMessage(msgId: number) {
    this._hubConnection.invoke("RemoveMessage", msgId);
  }

  public unblockUser(userId: string) {
    this._hubConnection.invoke("UnblockUser", userId);
  }
  public blockUser(userId: string) {
    this._hubConnection.invoke("BlockUser", userId);
  }
}
