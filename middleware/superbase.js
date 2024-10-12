const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabasePath = process.env.SUPABASE_PATH;
const supabase = createClient(supabaseUrl, supabaseKey);


const upLoadSupeebase = (file) => {
    const base64 = file.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    return buffer;
};

exports.uploadImage = async (file, bucketName) => {

    file = upLoadSupeebase(file);

    var fileName = Date.now().toString();

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`${fileName}.png`, file, {
            upsert: false,
            contentType: "image/png",
        });

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    let publicURL = `${supabaseUrl}/${supabasePath}/${bucketName}/${fileName}`;

    return publicURL;
};

exports.getImageUrl = (imagePath, bucketName) => {
    const { publicURL, error } = supabase
        .from(bucketName)
        .getPublicUrl(`${imagePath}`);

    if (error) {
        console.error('Error getting image URL:', error);
        return null;
    }

    return publicURL;
};

exports.updateImage = async (file, oldImagePath, bucketName) => {
    await exports.deleteImage(oldImagePath, bucketName);

    return await exports.uploadImage(file, bucketName);
};

exports.deleteImage = async (imagePath, bucketName) => {
    const regex = /[^/]+\.png$/;
    const match = imagePath.match(regex);

    if (match) {
        console.log('Image filename:', match[0]);
    }

    const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([match[0]]);

    if (error) {
        console.error('Error deleting image:', error);
        return null;
    }

    return data;
};

