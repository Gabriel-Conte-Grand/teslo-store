import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  // PONGO ANY PORQUE SINO TYPESCRIPT TIRA UN ERROR FALSO
  // console.log({ session });

  if (!session) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const validRoles = ['admin']

  if (!validRoles.includes(session.user.role)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return NextResponse.next()

  // const { token = '' } = req.cookies;
  // // return new Response('No autorizado', {
  // //     status: 401
  // // });
  // try {
  //     await jwt.isValidToken( token );
  //     return NextResponse.next();
  // } catch (error) {
  //     // return Response.redirect('/auth/login');
  //     const requestedPage = req.page.name;
  //     return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
  // }
}
