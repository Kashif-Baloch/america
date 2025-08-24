import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { checkFavoriteLimitServer } from "@/lib/subscription-utils";

async function getSession() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email || !session.user.id) {
      return null;
    }
    return session;
  } catch (error) {
    console.error("[AUTH_ERROR]", error);
    return null;
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const favorites = await db.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: {
          include: {
            translations: true,
            detail: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("[FAVORITES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const favoriteLimit = await checkFavoriteLimitServer(session.user.id);
    if (!favoriteLimit.canAdd) {
      return NextResponse.json(
        {
          error: `You've reached the maximum number of favorite jobs (${favoriteLimit.limit}) for your subscription plan. Please upgrade to save more jobs.`,
        },
        { status: 403 }
      );
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        translations: true,
        detail: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const existingFavorite = await db.favorite.findFirst({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Job already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await db.favorite.create({
      data: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: {
          include: {
            translations: true,
            detail: true,
          },
        },
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("[FAVORITES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const favorite = await db.favorite.findFirst({
      where: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    const deletedFavorite = await db.favorite.delete({
      where: {
        id: favorite.id,
      },
      include: {
        job: {
          include: {
            translations: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      jobId: deletedFavorite.jobId,
      job: deletedFavorite.job,
    });
  } catch (error) {
    console.error("[FAVORITES_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
