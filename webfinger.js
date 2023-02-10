const MAPPING = new Map([
  ['ps@pstadler.dev', 'ps@infosec.exchange']
])

async function handleRequest(request) {
  const account = (new URL(request.url).searchParams.get('resource') || '').replace('acct:', '')
  const targetAccount = MAPPING.get(account)

  if (!targetAccount) {
    return new Response('', {
      status: 404
    })
  }

  const [, domain] = targetAccount.split('@')
  const targetUrl = new URL(`https://${domain}/.well-known/webfinger`)
  targetUrl.searchParams.set('resource', `acct:${targetAccount}`)

  return fetch(targetUrl.toString())
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
