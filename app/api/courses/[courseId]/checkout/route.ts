import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const user = await currentUser()

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    })

    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(course.price! * 100),
          product_data: {
            name: course.title,
            description: course.description!,
          },
        },
      },
    ]

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    })

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      })

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      })
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_method_types: ['card'],
      customer: stripeCustomer.stripeCustomerId,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    console.error('[COURSE_ID_CHECKOUT]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
