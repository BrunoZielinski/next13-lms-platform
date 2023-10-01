import { File } from 'lucide-react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { Banner } from '@/components/banner'
import { Preview } from '@/components/preview'
import { getChapter } from '@/actions/get-chapter'
import { Separator } from '@/components/ui/separator'
import { VideoPlayer } from './_components/video-player'
import { CurseEnrollButton } from './_components/curse-enroll-button'
import { CourseProgressButton } from './_components/course-progress-button'

export default async function ChapterIdPage({
  params,
}: {
  params: {
    courseId: string
    chapterId: string
  }
}) {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const {
    course,
    chapter,
    muxData,
    purchase,
    attachments,
    nextChapter,
    userProgress,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  })

  if (!course || !chapter) {
    return redirect('/')
  }

  const isLocked = !chapter.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl pb-20 mx-auto">
        <div className="p-4">
          <VideoPlayer
            isLocked={isLocked}
            title={chapter.title}
            courseId={params.courseId}
            chapterId={params.chapterId}
            completeOnEnd={completeOnEnd}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
          />
        </div>

        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                courseId={params.courseId}
                chapterId={params.chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CurseEnrollButton
                price={course.price!}
                courseId={params.courseId}
              />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />

              <div className="p-4">
                {attachments.map(attachment => (
                  <a
                    target="_blank"
                    key={attachment.id}
                    href={attachment.url}
                    rel="noopener noreferrer nofollow external"
                    className="flex items-center w-full p-3 border rounded-md bg-sky-200 text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
