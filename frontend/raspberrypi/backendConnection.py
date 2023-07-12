import base64
import aiohttp


def get_hostname(hostname):
    return "http://" + hostname

def get_base_headers(csrf_token, auth=''):
    #Base headers for authorization and already authorized calls
    if auth=='':
        return {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrf_token
        }
    else:
        return {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrf_token,
            "Authorization": "Basic " + auth
        }

async def get_xsrf_token_async(session, hostname):
        #Obtain csrf-token from the server, used for later calls
        async with session.get(get_hostname(hostname) + 'auth/csrf') as response:
            await response.text()
            if response.status == 200:
                cookieJar = response.cookies
                session.cookie_jar.update_cookies(cookieJar)
                return cookieJar['XSRF-TOKEN'].value
            else:
                raise ValueError('HTTP Error')

async def authenticate_user(credentials, session, hostname):
    csrf_token = await get_xsrf_token_async(session, hostname)

    #Encode the credentials to base64
    basic_auth = base64.b64encode(credentials.encode('ascii'))

    headers = get_base_headers(csrf_token, basic_auth.decode('ascii'))

    #Login with the credentials and update cookies
    async with session.post(get_hostname(hostname) + 'auth/login', headers=headers) as response:
        authentication = await response.text()
        session.cookie_jar.update_cookies(response.cookies)
        return authentication

async def authorize_user(boxId, credentials, hostname):
    async with aiohttp.ClientSession() as session:
        #Wait for authentication to finish
        authenticate = await authenticate_user(credentials, session, hostname)

        csrf_token = await get_xsrf_token_async(session, hostname)
        #Extract and set csrf-token header
        for cookie in session.cookie_jar:
            if cookie.key == 'XSRF-TOKEN':
                csrf_token = cookie.value

        #Authorize user with box id
        async with session.get(get_hostname(hostname) + 'boxes/auth/' + boxId, headers=get_base_headers(csrf_token)) as response:
            permitted = await response.text()
            return permitted == 'true'

async def update_delivery(boxId, credentials, hostname):
    async with aiohttp.ClientSession() as session:
        #Wait for authentication to finish
        authenticate = await authenticate_user(credentials, session, hostname)

	#Obtain another csrf-token
        csrf_token = await get_xsrf_token_async(session, hostname)

        #Extract and set csrf-token header
        for cookie in session.cookie_jar:
            if cookie.key == 'XSRF-TOKEN':
                csrf_token = cookie.value

        #Update delivery status
        async with session.post(get_hostname(hostname) + 'boxes/closed/' + boxId, headers=get_base_headers(csrf_token)) as response:
            if response.status == 200:
                deliveryId = await response.text()
                return deliveryId
            else:
                raise ValueError('HTTP Error')

async def get_config(boxId, credentials, hostname):
        async with aiohttp.ClientSession() as session:
                #Wait for authentication to finish
                authenticate = await authenticate_user(credentials, session, hostname)
                #Obtain another csrf-token
                csrf_token = await get_xsrf_token_async(session, hostname)

                #Extract and set csrf-token header
                for cookie in session.cookie_jar:
                        if cookie.key == 'XSRF-TOKEN':
                                csrf_token = cookie.value

                #Receive box information for setup purposes
                async with session.get(get_hostname(hostname) + 'boxes/info/' + boxId, headers=get_base_headers(csrf_token)) as response:
                        box_info = await response.text()
                        return box_info
