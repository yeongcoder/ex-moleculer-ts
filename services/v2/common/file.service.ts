"use strict";

import {Service, ServiceBroker, Context} from "moleculer";

export default class FileService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "file",
			version: 2,
			actions:{
				/**
				 * Login action.
				 *
				 */
				hello: {
					rest: {
						method: "GET",
						path: "/hello",
					},
					async handler(ctx: Context): Promise<string> {
						return this.ActionLogin();
					},
				},
			},
		});
	}

	// Action
	public ActionLogin(): string {
		return `hello ${this.name}`;
	}
}
