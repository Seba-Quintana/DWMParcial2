export interface IResponse<T> {
    stsCode: string;
	stsMsg: string;
    data: T
}
