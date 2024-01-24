export default function requestData() {
    if (!window.location.search) {
        return {};
    }

    const queryString: { [key: string]: string } = {};

    new URLSearchParams(window.location.search).forEach((value, key) => {
        queryString[key] = value;
    });

    return { request_data: { queryString } };
}
