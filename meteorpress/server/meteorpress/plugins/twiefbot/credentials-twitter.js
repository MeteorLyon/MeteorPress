/**
 * @var   {object}      twitterCredentials
 * @description         Authorization tokens used by mrt:twit / twitmaker
 * @global
 *
 * TODO:
 *      This should ask for credentials on first run / install
 *          and then store those in the database and be all
 *          nice and self-contained here
 *
 */
twitterCredentials =  {
  access_token:           '',
  access_token_secret:    '',
  consumer_key:           '',
  consumer_secret:        ''
}
