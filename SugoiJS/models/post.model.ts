import {
    IBeforeFind,
    IBeforeRemove,
    IBeforeSave,
    IBeforeUpdate,
    Ignore,
    ModelAbstract,
    ModelName,
    Primary,
    QueryOptions,
    Required
} from "@sugoi/orm";
import rp = require("request-promise");
import {ComparableSchema, SchemaTypes} from "@sugoi/core";

@ModelName("posts")
export class PostModel extends ModelAbstract implements IBeforeSave, IBeforeUpdate,IBeforeFind,IBeforeRemove {
    protected static BASE_URL = "https://jsonplaceholder.typicode.com/";

    @Primary()
    protected id: number;

    @Required()
    public title: string;

    @Required(ComparableSchema.ofType(SchemaTypes.STRING))
    public body: string;

    @Ignore()
    public updatePublishDate:boolean = false;

    public publishDate: Date;


    constructor() {
        super();
    }

    beforeSave(): Promise<any> | void {
        this.publishDate = new Date();
        console.log("Going to save object");
    }

    beforeFind(query: any, options?: Partial<QueryOptions | any>): Promise<any> | void {
        const message = typeof query === "number" ?"Going to find resource by id %s" : "Going to find resources";
        console.log(message,query);
    }

    beforeUpdate(): Promise<any> | void {
        console.log("Going to update id %s",PostModel.getIdFromQuery(this,this,false));
        if(this.updatePublishDate){
            this.publishDate = new Date();
        }
    }

    beforeRemove(id: any, options?: Partial<QueryOptions | any>): Promise<any> | void {
        console.log("Going to remove id %s",id);
    }


    private static request(method: string, url: string, params = {}, body?: any, headers = {},parseJSON:boolean = true) {
        return rp({
            method: method,
            uri: url,
            qs: params,
            body: typeof body === "string" ? body : JSON.stringify(body),
            headers: headers,
        })
            .then((res) => {
                return parseJSON ? JSON.parse(res) : res;
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    }


    public static builder() {
        return new this();
    }

    public setTitle(title) {
        this.title = title;
        return this;
    }

    public setBody(body) {
        this.body = body;
        return this;
    }

    protected static getUrl() {
        return PostModel.BASE_URL + PostModel.getModelName();
    };

    protected static findEmitter<T = any>(query: any, options?: Partial<QueryOptions | any>): Promise<T> {
        const id = this.getIdFromQuery(query);
        let url = this.getUrl();
        if (id !== null) {
            url += "/" + id;
        }

        return this.request("GET", url, query)
    };


    protected saveEmitter<T>(options?: Partial<QueryOptions | any>, data?: any): Promise<T> {
        return PostModel.request("POST", PostModel.getUrl(), options, data);
    }

    protected updateEmitter<T>(options?: Partial<QueryOptions | any>, query?: any): Promise<T> {
        const id = PostModel.getIdFromQuery(query);
        const url = `${PostModel.getUrl()}/${id}`;
        return PostModel.request("PUT", url, query, this);
    }


    protected static removeEmitter<T = any>(id?: any, options?: Partial<QueryOptions | any>): Promise<T> {
        const url = `${this.getUrl()}/${id}`;
        return this.request("DELETE", url, {}, this);
    };


}