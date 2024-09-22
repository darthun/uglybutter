'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CldUploadWidget, CldImage } from 'next-cloudinary'

export default function Upload() {
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [supabase, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Upload Your Ugly Butter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <CldUploadWidget 
          uploadPreset="ugly_butter"
          onSuccess={(result, { widget }) => {
            const publicId = (result?.info as { public_id: string })?.public_id
            setUploadedImageId(publicId)
            widget.close()
          }}
        >
          {({ open }) => {
            function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
              e.preventDefault()
              open()
            }
            return (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full mb-4" onClick={handleOnClick}>
                Upload an Image
              </button>
            )
          }}
        </CldUploadWidget>
        
        {uploadedImageId && (
          <div className="mt-4">
            <p className="mb-2">Uploaded successfully:</p>
            <CldImage
              width="400"
              height="300"
              src={uploadedImageId}
              sizes="100vw"
              alt="Uploaded ugly butter"
            />
          </div>
        )}
      </div>
    </div>
  )
}