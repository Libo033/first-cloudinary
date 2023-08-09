import { ICloudinaryResponse, IFormUploader } from "@/Libs/interfaces";
import React, { FormEvent, useState } from "react";

const FormUploader: React.FC<IFormUploader> = (props) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [uploadData, setUploadData] = useState<
    ICloudinaryResponse | undefined
  >();

  function handleOnChange(changeEvent: any): void {
    try {
      const reader: FileReader = new FileReader();

      reader.onload = function (onLoadEvent: any) {
        setImageSrc(onLoadEvent.target.result);
        setUploadData(undefined);
      };

      reader.readAsDataURL(changeEvent.target.files[0]);
    } catch (error) {
      setUploadData(undefined);
      setImageSrc("");
    }
  }

  async function handleOnSubmit(event: FormEvent) {
    event.preventDefault();

    const fileInput: Element | undefined = Array.from(
      (event.currentTarget as HTMLFormElement).elements
    ).find(({ name }: any) => name === "file");

    const formData: FormData = new FormData();

    const fileList: FileList | null = (fileInput as HTMLInputElement).files;

    if (fileList === null) {
      throw new Error("Files cannot be null");
    }

    for (const file of fileList) {
      if (file.size > 10485760) {
        alert(`File size bigger than 10MB`);
        setUploadData(undefined);
        setImageSrc("");
        return;
      }
      formData.append("file", file);
    }

    formData.append("upload_preset", props.uploadPreset);

    const savingImage: Promise<ICloudinaryResponse> = new Promise(
      async (resolve, reject) => {
        const data = await fetch(
          "https://api.cloudinary.com/v1_1/dsuydyqgz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        ).then((r) => r.json());

        resolve(data);
      }
    );

    savingImage
      .then(async (data: ICloudinaryResponse) => {
        setImageSrc(data.secure_url);
        setUploadData(data);

        if (data.secure_url !== undefined && data.created_at !== undefined) {
          await fetch("/api/v1/images", {
            method: "POST",
            body: JSON.stringify({
              secure_url: data.secure_url,
              created_at: data.created_at,
            }),
            headers: { "Content-Type": "application/json" },
          })
            .then((r) => r.json())
            .catch((e) => {
              if (e instanceof Error) {
                console.log(e.message);
              }
            });
        }
      })
      .catch((e) => {
        if (e instanceof Error) {
          console.log(e.message);
        }
      });
  }

  return (
    <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
      <p>
        <input type="file" name="file" />
      </p>
      {imageSrc !== "" && <img src={imageSrc} alt="cloudinary" />}
      {imageSrc && !uploadData && (
        <p>
          <button>Upload Files</button>
        </p>
      )}
      {uploadData && (
        <code>
          <pre>{JSON.stringify(uploadData, null, 2)}</pre>
        </code>
      )}
    </form>
  );
};

export default FormUploader;
