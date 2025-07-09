
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// import { useAuth } from '../context/AuthContext';
import Navbar from "../components/navbar/Navbar"
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AccountPage = () => {
  // const { user, logout } = useAuth();


  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const [uploading, setUploading] = useState(false);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file || !file.name.endsWith('.glb')) {
    Swal.fire('Invalid File', 'Please upload a valid .glb file.', 'error');
    return;
  }

  const BUCKET = import.meta.env.VITE_REACT_APP_AWS_S3_BUCKET_NAME;
  const ACCESS_KEY = import.meta.env.VITE_REACT_APP_AWS_ACCESS_KEY_ID;
  const SECRET_KEY = import.meta.env.VITE_REACT_APP_AWS_SECRET_ACCESS_KEY;
  const REGION = import.meta.env.VITE_REACT_APP_AWS_REGION;

  if (!BUCKET || !ACCESS_KEY || !SECRET_KEY || !REGION) {
    Swal.fire({
      icon: "error",
      title: "AWS Configuration Error",
      text: "Missing AWS credentials or bucket name in .env",
    });
    return;
  }

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
  });

  const s3 = new AWS.S3({ apiVersion: "2012-10-17" });

  const fileKey = `${file.name}-${Date.now()}`;
  const params = {
    Bucket: BUCKET,
    Key: fileKey,
    Body: file,
    ContentType: "application/octet-stream",
  };

  try {
    setUploading(true);
    Swal.fire({
      title: "Uploading...",
      html: "Please wait while the file is being uploaded.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const uploadResult = await s3.upload(params).promise();

    const signedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: BUCKET,
      Key: fileKey,
      Expires: 60 * 60 * 24 * 7,
    });

    // Save link via API
    const response = await axios.post(
      `${API_BASE_URL}/api/links/secure`,
      { s3Url: signedUrl, name: fileKey.replace(".glb", "") },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    const shortCode = response.data.code;

    if (!shortCode || typeof shortCode !== 'string') {
      throw new Error('Invalid shortCode received from the API.');
    }

    const shareLink = `${window.location.origin}/share?code=${encodeURIComponent(shortCode)}`;

    setLinks((prev) => [{ _id: shortCode, name: shortCode }, ...prev]);

    Swal.fire({
      icon: "success",
      title: "Upload Successful",
      html: `
        <p>Link created:</p>
        <input type="text" class="swal2-input" value="${shareLink}" readonly />
        <button id="copyBtn" class="swal2-confirm swal2-styled">Copy Link</button>
      `,
      showConfirmButton: false,
      didRender: () => {
        document.getElementById('copyBtn')?.addEventListener('click', () => {
          navigator.clipboard.writeText(shareLink);
          Swal.fire({
            icon: 'success',
            title: 'Copied!',
            timer: 1500,
            showConfirmButton: false,
          });
        });
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    Swal.fire("Upload Failed", err.message || "Unknown error", "error");
  } finally {
    setUploading(false);
  }
};


  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_BASE_URL}/api/links`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLinks(res.data.links || []);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load links.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName || '');
  };

  const handleNameChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/api/links/${id}`,
        { name: editingName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLinks((prev) =>
        prev.map((link) =>
          link._id === id ? { ...link, name: editingName } : link
        )
      );
      setEditingId(null);
      setEditingName('');

      await Toast.fire({
        icon: 'success',
        title: 'Link name updated!',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update link name.', 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      await Toast.fire({
        icon: 'success',
        title: 'Link copied to clipboard!',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to copy link.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the link permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLinks((prev) => prev.filter((link) => link._id !== id));

      await Toast.fire({
        icon: 'success',
        title: 'Link deleted',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to delete the link.', 'error');
    }
  };

  // const handleLogout = async () => {
  //   logout();
  //   navigate('/login');

  //   await Toast.fire({
  //     icon: 'info',
  //     title: 'Logged out successfully!',
  //   });
  // };



  if (loading) return <div className="text-center mt-5">Loading your links...</div>;

  return (
    <>
      <Navbar />

      <div className="container mt-5 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">My Dashboard</h3>
          {/* <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
          </button> */}
        </div>

<div className="mb-4 text-center">
  <label className="btn btn-success px-4">
    Upload .glb File only
    <input
      type="file"
      accept=".glb"
      style={{ display: "none" }}
      onChange={handleFileUpload}
      disabled={uploading}
    />
  </label>
</div>


        <div className="row">
          {/* Editable Names Column */}
          <div className="col-md-6 mb-4">
            <h5>Link Names</h5>
            {links.length === 0 && <p>No links created yet.</p>}
            {links.map((link) => (
              <div key={link._id} className="input-group mb-3">
                <input
                  type="text"
                  value={editingId === link._id ? editingName : link.name}
                  onChange={editingId === link._id ? handleNameChange : undefined}
                  readOnly={editingId !== link._id}
                  className={`form-control ${editingId === link._id ? '' : 'form-control-plaintext'}`}
                />
                <div className="input-group-append">
                  {editingId === link._id ? (
                    <>
                      <button onClick={() => handleSave(link._id)} className="btn btn-success">Save</button>
                      <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(link._id, link.name)}
                      className="btn btn-outline-primary"
                    >
                      Rename
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Link URLs Column */}
          <div className="col-md-6">
            <h5>Links</h5>
            {links.length === 0 && <p>No links created yet.</p>}
            {links.map((link) => {
              const shortUrl = `${window.location.origin}/share?code=${link.name}`;
              return (
                <div key={link._id} className="input-group mb-3">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Visit
                  </a>
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="form-control"
                  />
                  <div className="input-group-append gap-2">
                    <button onClick={() => handleCopy(shortUrl)} className="btn btn-outline-secondary">Copy</button>
                    <button onClick={() => handleDelete(link._id)} className="btn btn-outline-danger">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
