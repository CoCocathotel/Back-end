const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require('uuid');


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabasePath = process.env.SUPABASE_PATH;
const supabase = createClient(supabaseUrl, supabaseKey);


const upLoadSupeebase = (file) => {
    const base64 = file.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    return buffer;
};

exports.uploadImage = async (file, bucketName, slug) => {
    file = upLoadSupeebase(file);
    if (file) {

        var fileName = uuidv4() + Date.now().toString();

        slug = slug ? `${slug}/` : '';
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`${slug}${fileName}.png`, file, {
                upsert: false,
                contentType: "image/png",
            });

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        let publicURL = `${supabaseUrl}/${supabasePath}/${bucketName}/${slug}${fileName}.png`;

        return publicURL;
    }
    return;
};

exports.updateImage = async (file, oldImagePath, bucketName, slug) => {
    if (oldImagePath) {
        await exports.deleteImage(oldImagePath, bucketName, slug);
    }
    let url = await exports.uploadImage(file, bucketName, slug);

    return url;
};

exports.deleteImage = async (imagePath, bucketName, slug) => {
    const regex = /[^/]+\.png$/;
    console.log('imagePath:', imagePath);

    const match = imagePath.match(regex);
    slug = slug ? `${slug}/` : '';
    
    if (!match) {
        console.error('Error: Image path did not match the expected format:', imagePath);
        return null;
    }

    const imageName = match[0];

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .remove([`${slug}${imageName}`]);

        if (error) {
            console.error('Error deleting image:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error while deleting image:', err.message);
        return null;
    }
};


// exports.getImageUrl = (imagePath, bucketName, slug) => {
//     const regex = /[^/]+\.png$/;
//     const match = imagePath.match(regex);
//     slug = slug ? `${slug}/` : '';

//     if (!match) {
//         console.error('Error: Image path did not match the expected format:', imagePath);
//         return null;
//     }

//     console.log('match:', match);
//     const imageName = match[0];

//     const { publicURL, error } = supabase
//         .from(bucketName)
//         .getPublicUrl([`${slug}${imageName}`]);

//     if (error) {
//         console.error('Error getting image URL:', error);
//         return null;
//     }

//     return publicURL;
// };
