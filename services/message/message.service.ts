"use strict";

import {Service, ServiceBroker, Context} from "moleculer";

export default class MessageService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "message",
			actions:{
				/**
				 * Say a 'Hello' action.
				 *
				 */
				chat: {
					async handler(ctx:Context<{text: string, room: string},any>): Promise<number> {

						console.log("ctx.meta.$rooms: ", ctx.meta.$rooms);
						console.log("ctx.meta.$user: ", ctx.meta.$user);

						this.logger.info(`"${ctx.meta.socket.id}" chat : ${ctx.params.text}`);

						if(ctx.params.room){

							ctx.meta.socket.to(ctx.params.room).emit('chat',`${ctx.meta.socket.id}: ${ctx.params.text}`);

						} else {

							//ctx.meta.socket.emit('chat',`${ctx.params.text}`);

						}
						ctx.meta.user
						return 0;
					},
				},
				join: {
					async handler(ctx:Context<{ room: string },any>): Promise<number> {

						this.logger.info(`"${ctx.meta.socket.id}" join to ${ctx.params.room}`);

						ctx.meta.socket.to(ctx.params.room).emit('noti',`"${ctx.meta.socket.id}" join`);

						ctx.meta.$join = ctx.params.room;

						return 0;
					},
				},
				leave: {
					async handler(ctx:Context<{ room: string },any>): Promise<number> {

						this.logger.info(`"${ctx.meta.socket.id}" leave from ${ctx.params.room}`);

						ctx.meta.socket.to(ctx.params.room).emit('noti',`"${ctx.meta.socket.id}" leave`);

						ctx.meta.$leave = ctx.params.room;

						return 0;
					},
				}
			},
		});
	}
}
