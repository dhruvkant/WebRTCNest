import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppService {
  private connections = new Map<string, RTCPeerConnection>();
  private connectionCompleted$ = new Subject<RTCPeerConnection>();

  getHello(): string {
    return 'Hello World!';
  }

  initiateConnectionAs(type: string): Observable<RTCPeerConnection> {
    const connection = this.getConnection(type);
    const isCompleted$ = new Subject<RTCPeerConnection>();
    if (type === 'caller') {
      connection.createOffer().then((offer) => {
        connection.setLocalDescription(offer);
      });
      return this.connectionCompleted$.asObservable();
    } else {
      const callerConnection = this.getConnection('caller');
      connection.setRemoteDescription(callerConnection.localDescription);
      connection.createAnswer().then((answer) => {
        connection.setLocalDescription(answer).then(() => {
          callerConnection.setRemoteDescription(answer).then();
          this.connectionCompleted$.next(callerConnection);
          isCompleted$.next(connection);
        });
      });
      return isCompleted$.asObservable();
    }
  }

  private getConnection(type: string): RTCPeerConnection {
    if (this.connections.has(type)) {
      return this.connections.get(type);
    } else {
      const connection = new RTCPeerConnection(this.getRTCConfiguration());
      this.connections.set(type, connection);
      return connection;
    }
  }

  private getRTCConfiguration(): RTCConfiguration {
    return {
      iceServers: this.getIceServers(),
    };
  }

  private getIceServers(): RTCIceServer[] {
    return [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ];
  }
}
